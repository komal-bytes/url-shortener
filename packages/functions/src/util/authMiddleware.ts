import { HonoContext } from 'hono';
import { supabase } from 'packages/functions/src/util/supabaseClient';


export const authMiddleware = async (c: HonoContext, next: () => Promise<void>) => {
    const token = c.req.headers.get('authorization')?.split(' ')[1];

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
