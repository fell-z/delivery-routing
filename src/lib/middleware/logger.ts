import { createMiddleware } from "hono/factory";

type PrintFunc = (...data: any[]) => void;

export function logger(fn: PrintFunc = console.debug) {
  return createMiddleware(async (c, next) => {
    const { method, url, raw } = c.req;
    const path = url.slice(url.indexOf("/", 8));
    fn("<--" /* Incoming */, method, path);
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
    fn("-->" /* Outgoing */, method, path, c.res.status, time(start));
    fn(JSON.stringify(responseBody, null, 2));
  });
}
