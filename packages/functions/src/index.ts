import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { getUrl } from "packages/functions/src/getUrl";
import { getUrls } from "packages/functions/src/getUrls";
import { shorten } from "packages/functions/src/shorten";

const api = new Hono();

api.use('*', authMiddleware());
api.get("/urls", getUrls);
api.get("/urls/:id", getUrl);
api.post("/shorten", shorten);

export const honoHandler = handle(api);
