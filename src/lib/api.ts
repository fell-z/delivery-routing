import { Hono } from "hono";
import { env } from "hono/adapter";
import type { ClientBody } from "#lib/types.ts";
import { toApiBody } from "#lib/util.ts";

function defaultHeaders(): Headers {
  const h = new Headers();
  h.append("Accept", "application/json");
  h.append("Accept", "application/geo+json");
  h.append("Content-Type", "application/json");
  return h;
}

const api = new Hono()
  .get("/clock", (c) => {
    const time = new Date().toLocaleTimeString();
    return c.json({
      time,
    });
  })
  .post("/route", async (c) => {
    const actionURL = "https://api.heigit.org/vroom/v0";
    const { API_KEY } = env<{ API_KEY: string }>(c);

    const cbody = await c.req.json<ClientBody>();
    const abody = toApiBody(cbody);

    console.log("Converted API body:");
    console.log(JSON.stringify(abody, null, 2));

    try {
      const headers = defaultHeaders();
      headers.append("Authorization", API_KEY);

      const response = await fetch(actionURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(abody),
      });

      if (!response.ok) {
        throw new Error(`FetchError => Response status: ${response.status}`);
      }

      const data = await response.json();
      if (data.code !== 0) {
        let errorType = "";
        switch (data.code) {
          case 1:
            errorType = "InternalError";
            break;
          case 2:
            errorType = "InputError";
            break;
          case 3:
            errorType = "RoutingError";
            break;
        }

        throw new Error(`ApiError => A ${errorType} occurred.\nError message: ${data?.error}`);
      }

      return c.json(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  });

export default api;
