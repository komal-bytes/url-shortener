// Create an S3 bucket
// export const bucket = new sst.aws.Bucket("Uploads");

// Create the DynamoDB table
export const usersTable = new sst.aws.Dynamo("Users", {
    fields: {
        id: "string",
        // email: "string",
        // password: "string",
        // createdAt: "number",
    },
    primaryIndex: { hashKey: "id" },
});

export const urlsTable = new sst.aws.Dynamo("Urls", {
    fields: {
        id: "string", // Short URL ID
        // userId: "string",
        // originalUrl: "string", // Original URL
        // shortUrl: "string"
    },
    primaryIndex: { hashKey: "id" },
});

export const analyticsTable = new sst.aws.Dynamo("Analytics", {
    fields: {
        id: "string", // Unique ID for analytics (e.g., URL ID or UUID)
        // urlId: "string",
        // url: "string",
        // clicks: "number", // Number of clicks
        // timestamp: "string", // Timestamp of access
    },
    primaryIndex: { hashKey: "id" },
});