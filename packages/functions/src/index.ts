import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { getUrl } from "packages/functions/src/getUrl";
import { getUrls } from "packages/functions/src/getUrls";
import { shorten } from "packages/functions/src/shorten";
import { supabase } from 'packages/functions/src/util/supabaseClient';
import { deleteUrl } from "packages/functions/src/deleteUrl";
import { getStatsFilters } from "packages/functions/src/getStatsFilters";
import { getStats } from "./getStats";

const api = new Hono();

api.get("/:id", getUrl);
api.use('/user/*', async (c, next) => {

    // console.log(c.req.header("Authorization"), "headers")
    console.log("check here yoyo")
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return c.json({ message: 'You are Unauthenticated' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
        return c.json({ message: 'You are Unauthorized' });
    }

    // console.log(data.user, "data.user")

    c.set('user', data?.user?.id);
    await next();
});

api.get("/user/urls", getUrls);
api.post("/user/shorten", shorten);
api.delete("/user/deleteUrl/:id", deleteUrl);
api.get("/user/statsFilters/:id", getStatsFilters);
api.get('/user/stats/:id', getStats)

export const honoHandler = handle(api);
