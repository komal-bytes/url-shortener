import { hono } from "./api";

const region = aws.getRegionOutput().name;
console.log(hono.url, "hono url")
console.log(process.env.API_URL, "api url")
export const frontend = new sst.aws.StaticSite("Frontend", {
    path: "packages/frontend",
    build: {
        output: "dist",
        command: "bun run build",
    },
    domain: $app.stage === "production" ? {
        name: "quicklink.komal.codes",
        dns: false,
        cert: process.env.QUICKLINK_CERT
    } : undefined,
    environment: {
        VITE_REGION: region,
        VITE_API_URL: $app.stage === "production" ? process.env.API_URL : hono.url,
        VITE_APP_URL: process.env.APP_URL,
        VITE_APP_STAGE: $app.stage,
        VITE_SUPABASE_URL: process.env.SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
        // VITE_BUCKET: bucket.name,
        // VITE_USER_POOL_ID: userPool.id,
        // VITE_IDENTITY_POOL_ID: identityPool.id,
        // VITE_USER_POOL_CLIENT_ID: userPoolClient.id,
    },
});