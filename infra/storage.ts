// Create an S3 bucket
// export const bucket = new sst.aws.Bucket("Uploads");

// Create the DynamoDB table
// export const usersTable = new sst.aws.Dynamo("Users", {
//     fields: {
//         id: "string",
//         // email: "string",
//         // password: "string",
//         // createdAt: "number",
//     },
//     primaryIndex: { hashKey: "id" },
// });

export const urlsTable = new sst.aws.Dynamo("Urls", {
    fields: {
        id: "string",
        userId: "string",
    },
    primaryIndex: { hashKey: "id" },
    globalIndexes: {
        userIdIndex: { hashKey: "userId" },
    },
});

export const analyticsTable = new sst.aws.Dynamo("Analytics", {
    fields: {
        id: "string",
        urlId: "string",
    },
    primaryIndex: { hashKey: "id" },
    globalIndexes: {
        urlIdIndex: { hashKey: "urlId" },
    },
});