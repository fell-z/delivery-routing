import app from "#lib/app.ts";
import type { RequestHandler } from "./$types";

export const fallback: RequestHandler = ({ request }) => app.fetch(request);
