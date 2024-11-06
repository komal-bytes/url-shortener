// import { Resource } from "sst";
// import { Util } from "./util/index";
// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// export const getUrls = async (event) => {
//     try {

//         const params = {
//             TableName: Resource.Urls.name,
//         };

//         const result = await dynamoDb.send(new ScanCommand(params));
//         if (result?.Items?.length === 0) {
//             throw new Error("No Items Found.");
//         }

//         return event.json({ urls: result.Items })

//     } catch (err) {
//         console.log(err, "errr")
//         event.json({
//             statusCode: 500,
//             error: err
//         })
//     }

// };


import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const getUrls = async (event: any) => {
    try {

        console.log("here")
        const userId = event.get('user');

        if (!userId) {
            throw new Error('User ID is missing')
        }

        const params = {
            TableName: Resource.Urls.name,
            IndexName: "userIdIndex",
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId,
            },
        };

        const data = await dynamoDb.send(new QueryCommand(params));

        return event.json({ urls: data.Items || [] });
    } catch (error) {
        console.error(error);
        return event.text(error, 500);
    }
};
