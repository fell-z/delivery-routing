import { hc } from "hono/client";
import type { AppType } from "#lib/app.ts";
import { browser } from "$app/env";

export const appClient = hc<AppType>(browser ? location.origin : "");
