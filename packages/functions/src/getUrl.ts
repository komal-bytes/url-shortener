import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { Resource } from 'sst';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { UAParser } from 'ua-parser-js';
import axios from 'axios';

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const app = new Hono();

export const getUrl = async (event: any) => {
    try {

        console.log("test here")
        const id = event.req.param('id');
        if (!id) {
            throw new Error("URL ID is required.")
        }

        const scanParams = {
            TableName: Resource.Urls.name,
            FilterExpression: "urlId = :urlId",
            ExpressionAttributeValues: {
                ":urlId": { S: id }
            }
        };

        const scan = dynamoDb.send(new ScanCommand(scanParams));

        if (!scan.Items) throw new Error("Url Not Found")

        const userAgent = event?.req?.header('user-agent');
        const referralURL = event?.req?.header('referer') ? new URL(event?.req?.header('referer')) : 'direct';
        const referrer = referralURL?.host || 'direct';
        const ipAddress = event?.req?.header('x-forwarded-for') || event?.req?.ip;
        const timestamp = new Date().toISOString();
        const uniqueId = nanoid();

        const parser = new UAParser(userAgent);
        const device = parser?.getDevice()?.type || 'Desktop';
        const browser = parser?.getBrowser()?.name || 'Other';
        const os = parser?.getOS()?.name || 'Other';
        // console.log(parser.getOS(), "os")

        const data = ipAddress ? await getCountry(ipAddress) : "Unknown";

        const analyticsData = {
            id: uniqueId,
            urlId: id,
            timestamp,
            referrer,
            referralURL,
            device,
            browser,
            os,
            country: data?.country || "Unknown",
            city: data?.city || "Unknown",
        };

        const putParams = {
            TableName: Resource.Analytics.name,
            Item: analyticsData,
        };


        await dynamoDb.send(new PutCommand(putParams));


        const updateParams = {
            TableName: Resource.Urls.name,
            Key: { id },
            UpdateExpression: 'SET clicks = if_not_exists(clicks, :start) + :incr',
            ExpressionAttributeValues: {
                ':incr': 1,
                ':start': 0,
            },
        };

        await dynamoDb.send(new UpdateCommand(updateParams));


        const getParams = {
            TableName: Resource.Urls.name,
            Key: { id },
        };

        let originalUrl;

        // console.log(getParams)

        const result = await dynamoDb.send(new GetCommand(getParams));
        // console.log(result, "result")
        originalUrl = result.Item.originalUrl;

        return event.redirect(originalUrl);

    } catch (error) {
        return event.text(error, 500);
    }
}

export default app;

async function getCountry(ipAddress: string) {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
        if (response.data.status === 'success') {
            // console.log(response.data)
            const { country, city } = response.data;
            return {
                country: country || 'Unknown',
                city: city || 'Unknown',
            };
        }
    } catch (error) {
        console.error('Error fetching country:', error);
    }
    // return 'Unknown';
}
