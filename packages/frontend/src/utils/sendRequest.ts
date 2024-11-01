import { supabase } from "@/supabaseClient";
import axios, { Method } from "axios";


interface RequestOptions {
    path?: string;
    method: Method;
    pathParams?: Record<string, any>;
    queryParams?: Record<string, any>;
    body?: Record<string, any>;
}

export const sendRequest = async ({
    path = "",
    method,
    pathParams = {},
    queryParams = {},
    body = {},
}: RequestOptions) => {
    let url = `${import.meta.env.VITE_API_URL}${path}`;

    console.log(pathParams)
    if (pathParams) {
        Object.keys(pathParams).forEach((key) => {
            url = url.replace(`:${key}`, encodeURIComponent(pathParams[key]));
        });
    }

    if (queryParams) {
        const queryString = new URLSearchParams(queryParams).toString();
        url += queryString ? `?${queryString}` : "";
    }

    const { data: session } = await supabase.auth.getSession();

    try {
        const response = await axios({
            url,
            method,
            data: body,
            headers: {
                Authorization: `Bearer ${session?.session?.access_token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};
