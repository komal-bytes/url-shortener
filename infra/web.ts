import { hono } from "./api";
// import { userPool, identityPool, userPoolClient } from "./auth";

const region = aws.getRegionOutput().name;

export const frontend = new sst.aws.StaticSite("Frontend", {
    path: "packages/frontend",
    build: {
        output: "dist",
        command: "bun run build",
    },
    domain: $app.stage === "production" ? "demo.sst.dev" : undefined,
    environment: {
        VITE_REGION: region,
        VITE_API_URL: hono.url,
        VITE_SUPABASE_URL: process.env.SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
        // VITE_BUCKET: bucket.name,
        // VITE_USER_POOL_ID: userPool.id,
        // VITE_IDENTITY_POOL_ID: identityPool.id,
        // VITE_USER_POOL_CLIENT_ID: userPoolClient.id,
    },
});