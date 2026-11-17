import app from "./app";
import { logger } from "./lib/logger";
import { seedSanadContent } from "./lib/seedSanadContent";
import { seedAdminFromEnvironment } from "./lib/seedAdmin";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

void seedSanadContent()
  .then(() => seedAdminFromEnvironment())
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }

      logger.info({ port }, "Server listening");
    });
  })
  .catch((error: unknown) => {
    logger.error({ err: error }, "Failed to prepare Sanad content");
    process.exit(1);
  });
