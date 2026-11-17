import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

// لا نسمح بعكس أي Origin عشوائي مع ملفات تعريف الارتباط.
// في الإنتاج حدّد CORS_ORIGINS كقائمة مفصولة بفواصل.
const configuredOrigins = new Set(
  (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);
const isDevelopment = process.env.NODE_ENV !== "production";
const localDevelopmentOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;


app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      // الطلبات من نفس المصدر وبعض أدوات الخادم لا ترسل Origin.
      if (!origin || configuredOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      if (isDevelopment && localDevelopmentOrigin.test(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  }),
);

const stateChangingMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
app.use("/api", (req, res, next) => {
  if (!stateChangingMethods.has(req.method)) {
    next();
    return;
  }

  const origin = req.get("origin");
  const allowedOrigin =
    origin !== undefined &&
    (configuredOrigins.has(origin) ||
      (isDevelopment && localDevelopmentOrigin.test(origin)));
  if (!allowedOrigin) {
    res.status(403).json({ error: "مصدر الطلب غير مسموح." });
    return;
  }
  next();
});

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  // لا ترسل X-Frame-Options DENY/SAMEORIGIN؛ معاينة Manus تعمل داخل HTTPS iframe.
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📸 خدمة ملفات الرفع
const UPLOADS_DIR = path.resolve(process.cwd(), "artifacts/sanad-taiz/public/uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use(
  "/uploads",
  express.static(UPLOADS_DIR, {
    maxAge: "30d",
    immutable: true,
    fallthrough: false,
  })
);

app.use("/api", router);

export default app;
