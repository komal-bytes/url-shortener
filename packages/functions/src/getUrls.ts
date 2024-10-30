import { Resource } from "sst";
import { Util } from "./util/index";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const getUrls = async (event) => {
    try {

        const params = {
            TableName: Resource.Urls.name,
        };

        const result = await dynamoDb.send(new ScanCommand(params));
        if (result?.Items?.length === 0) {
            throw new Error("No Items Found.");
        }

        return event.json({ urls: result.Items })

    } catch (err) {
        console.log(err, "errr")
        event.json({
            statusCode: 500,
            error: err
        })
    }

};
