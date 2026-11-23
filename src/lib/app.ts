import "dotenv/config";
import { Hono } from "hono";
import { logger } from "#lib/middleware/logger.ts";
import api from "#lib/api.ts";

const app = new Hono()
  .use(logger())
  .route("/api", api);

export type AppType = typeof app;
export default app;
