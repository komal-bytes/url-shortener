import { Resource } from "sst";
import { Util } from "./util/index";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { nanoid } from "nanoid";
import axios from "axios";
import * as cheerio from "cheerio";


const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const shorten = async (event: any) => {
    try {
        console.log("here")
        const body = await event.req.json();
        const originalUrl = body?.url;
        const customUrl = body?.customUrl;
        const parsedUrl = new URL(event.req.url);
        const domain = process.env.DOMAIN || parsedUrl.hostname;
        const user = event.get('user');

        if (!originalUrl) {
            throw new Error("URL parameter is required.")
        }

        let uniqueShortId;
        if (customUrl) {
            const getParams = {
                TableName: Resource.Urls.name,
                Key: { id: customUrl },
            };
            const existingItem = await dynamoDb.send(new GetCommand(getParams));
            if (existingItem?.Item) throw new Error("Code already taken. Try a new One.")
            uniqueShortId = customUrl
        } else {

            uniqueShortId = customUrl ? customUrl : null;
            while (true) {
                uniqueShortId = nanoid(8);

                const getParams = {
                    TableName: Resource.Urls.name,
                    Key: { id: uniqueShortId },
                };
                const existingItem = await dynamoDb.send(new GetCommand(getParams));

                if (!existingItem.Item) break;
            }

        }

        const shortUrl = `https://${domain}/${uniqueShortId}`;
        const { data: html } = await axios.get(originalUrl);
        const $ = cheerio.load(html);
        const pageTitle = $("title").text() || "No Title";

        // console.log(pageTitle, user, "check here");
        // return;

        const putParams = {
            TableName: Resource.Urls.name,
            Item: {
                id: uniqueShortId,
                userId: user,
                originalUrl: originalUrl,
                shortUrl: shortUrl,
                clicks: 0,
                name: pageTitle,
                createdAt: new Date().toISOString(),
            },
        };

        const result = await dynamoDb.send(new PutCommand(putParams));

        return event.json({ shortUrl })

    } catch (error) {
        return event.text(error, 500);
    }

};
