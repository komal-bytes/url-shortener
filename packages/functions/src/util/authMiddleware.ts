// import { HonoContext } from 'hono';
import { supabase } from 'packages/functions/src/util/supabaseClient';


export const authMiddleware = async (c, next: () => Promise<void>) => {

    console.log(c.req.headers, "headers")
    const token = c.req.headers.get('authorization')?.split(' ')[1];
    console.log(token, "token")
    if (!token) {
        return c.json({ message: 'Unauthenticated' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
        return c.json({ message: 'Unauthorized' });
    }

    c.set('user', data.user);
    await next();
};
