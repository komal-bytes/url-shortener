import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { getUrl } from "packages/functions/src/getUrl";
import { getUrls } from "packages/functions/src/getUrls";
import { shorten } from "packages/functions/src/shorten";
import { authMiddleware } from "packages/functions/src/util/authMiddleware";
import { supabase } from 'packages/functions/src/util/supabaseClient';

const api = new Hono();

api.get("/:id", getUrl);
api.use('*', async (c, next) => {

    // console.log(c.req.header("Authorization"), "headers")
    // console.log("check here yoyo")
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return c.json({ message: 'You are Unauthenticated' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
        return c.json({ message: 'You are Unauthorized' });
    }

    c.set('user', data.user);
    await next();
});

api.get("/urls", getUrls);
api.post("/shorten", shorten);

export const honoHandler = handle(api);
