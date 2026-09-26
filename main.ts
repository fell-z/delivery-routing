import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { createMiddleware } from "hono/factory";
import { logger } from "hono/logger";
import api from "./app/api.ts";

/**
 * Logger middleware for development; based on Hono's default logger middleware
 */
export const devLoggerMiddleware = createMiddleware(async (c, next) => {
  const { method, url, raw } = c.req;
  const path = url.slice(url.indexOf("/", 8));
  console.debug("<--" /* Incoming */, method, path);
  if (method === "POST" || method === "PUT" || method === "PATCH") {
    try {
      const requestBody = await raw.clone().json();
      console.log("Request Body:", JSON.stringify(requestBody, null, 2));
    } catch (_e) {
      console.log("Request Body (not JSON or empty):", await c.req.text());
    }
  }
  const start = Date.now();

  await next();

  const time = (start: number) => {
    const delta = Date.now() - start;
    return delta < 1e3 ? delta + "ms" : Math.round(delta / 1e3) + "s";
  };

  const originalResponse = c.res.clone();
  const responseBody: any = await originalResponse.json();
  console.debug("-->" /* Outgoing */, method, path, c.res.status, time(start));
  console.debug(JSON.stringify(responseBody, null, 2));
});

const app = new Hono()
  .use(logger())
  .use("/*", serveStatic({ root: "./public" }))
  .use("/api/*", devLoggerMiddleware)
  .route("/api", api);

const port = parseInt(Deno.env.get("PORT") || "8787");
Deno.serve({ port }, app.fetch);
