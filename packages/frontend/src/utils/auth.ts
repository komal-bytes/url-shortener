import { supabase } from '../supabaseClient';


export const signUpWithEmail = async (email: string, password: string) => {
    return await supabase.auth.signUp({
        email, password, options: {
            emailRedirectTo: import.meta.env.APP_STAGE === "production" ? `${import.meta.env.VITE_APP_URL}/confirm` : `http://127.0.0.1:5173/confirm`,
        },
    });
};

export const signInWithEmail = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
};

export const signInWithGitHub = async () => {
    return await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: import.meta.env.APP_STAGE === "production" ? `${import.meta.env.VITE_APP_URL}` : `http://127.0.0.1:5173`,
        },
    })
};
