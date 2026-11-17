import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

// مجلد الرفع: artifacts/sanad-taiz/public/uploads
const UPLOAD_DIR = path.resolve(process.cwd(), "artifacts/sanad-taiz/public/uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const MIME_BY_EXTENSION: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function matchesImageSignature(file: {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}): boolean {
  const extension = path.extname(file.originalname).toLowerCase();
  const { buffer } = file;
  if (MIME_BY_EXTENSION[extension] !== file.mimetype) return false;

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case ".png":
      return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    case ".webp":
      return buffer.length >= 12 &&
        buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
        buffer.subarray(8, 12).toString("ascii") === "WEBP";
    case ".gif": {
      const signature = buffer.subarray(0, 6).toString("ascii");
      return signature === "GIF87a" || signature === "GIF89a";
    }
    default:
      return false;
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_TYPES.includes(file.mimetype) && ALLOWED_EXTS.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error("نوع الملف غير مدعوم. المسموح: jpg, png, webp, gif"));
    }
  },
});

router.post("/admin/upload", requireAdmin, (req, res): void => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({ error: "حجم الملف كبير جداً (الحد 5 MB)" });
        return;
      }
      res.status(400).json({ error: err.message });
      return;
    }
    if (err) {
      res.status(400).json({ error: err.message || "فشل رفع الملف" });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: "لم يتم استلام أي ملف" });
      return;
    }
    if (!matchesImageSignature(req.file)) {
      res.status(415).json({ error: "محتوى الملف لا يطابق نوع الصورة المسموح." });
      return;
    }

    const extension = path.extname(req.file.originalname).toLowerCase();
    const filename = `${crypto.randomUUID()}${extension}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    fs.writeFile(filePath, req.file.buffer, { flag: "wx" }, (writeError) => {
      if (writeError) {
        console.error("Image upload could not be written.", writeError);
        res.status(500).json({ error: "تعذّر حفظ الصورة." });
        return;
      }

      // رابط نسبي؛ لا يُشتق أي أصل عام من Host الداخلي للخادم.
      res.json({ url: `/uploads/${filename}`, filename, size: req.file!.size });
    });
  });
});

export default router;
