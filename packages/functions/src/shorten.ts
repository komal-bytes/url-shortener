import { Resource } from "sst";
import { Util } from "./util/index";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { nanoid } from "nanoid";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const shorten = async (event) => {
    try {

        const body = await event.req.json();
        const originalUrl = body?.url;
        const customUrl = body?.customUrl;
        const domain = event.req.url

        if (!originalUrl) {
            throw new Error("URL parameter is required.")
        }

        let uniqueShortId = customUrl ? customUrl : null;
        while (true && !uniqueShortId) {
            uniqueShortId = nanoid(8);

            const getParams = {
                TableName: Resource.Urls.name,
                Key: { id: uniqueShortId },
            };
            const existingItem = await dynamoDb.send(new GetCommand(getParams));

            if (!existingItem.Item) break;
        }

        const shortUrl = `${domain}/${uniqueShortId}`;

        const putParams = {
            TableName: Resource.Urls.name,
            Item: {
                id: uniqueShortId,
                originalUrl: originalUrl,
                shortUrl: shortUrl,
                createdAt: new Date().toISOString(),
            },
        };

        const result = await dynamoDb.send(new PutCommand(putParams));

        return event.json({ shortUrl })

    } catch (err) {
        console.log(err);
        return event.json({ statusCode: 500, err })
    }

};
