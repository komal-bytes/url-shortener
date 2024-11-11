import { urlsTable, analyticsTable } from "./storage";

export const hono = new sst.aws.Function("Hono", {
    url: true,
    link: [urlsTable, analyticsTable],
    handler: "packages/functions/src/index.honoHandler",
    environment: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
    }
});

export const router = new sst.aws.Router("MyRouter", {
    domain: {
        name: $app.stage === "production" ? "link.komal.codes" : undefined,
        dns: false,
        cert: process.env.LINK_CERT
    },
    routes: {
        "/*": hono.url
    }
});