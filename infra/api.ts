import { urlsTable, analyticsTable } from "./storage";

// Define the SST function
export const hono = new sst.aws.Function("Hono", {
    url: true,
    link: [urlsTable, analyticsTable],
    handler: "packages/functions/src/index.honoHandler",
});