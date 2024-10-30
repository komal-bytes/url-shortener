import { Resource } from "sst";
import { Util } from "./util/index";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const getUrl = async (event) => {
    try {
        const id = event.req.param('id');
        // console.log(id , "id")
        if (!id) {
            return event.json({
                statusCode: 400,
                error: "ID is required.",
            });
        }

        const getParams = {
            TableName: Resource.Urls.name,
            Key: { id },
        };


        const result = await dynamoDb.send(new GetCommand(getParams));

        console.log(result)

        if (!result.Item) {
            return event.json({
                statusCode: 404,
                error: "URL not found.",
            });
        }

        const originalUrl = result.Item.originalUrl;

        return event.json({
            statusCode: 200,
            url: originalUrl,
        });

    } catch (error) {
        console.error("Error fetching URL from DynamoDB:", error);
        return event.json({
            statusCode: 500,
            body: "Could not fetch the URL.",
        });
    }
};
