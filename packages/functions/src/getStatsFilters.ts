import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const getStatsFilters = async (event: any) => {
    try {
        const urlId = event.req.param("id");
        const scanResponse = await dynamodb.send(new QueryCommand({
            TableName: Resource.Analytics.name,
            IndexName: 'urlIdIndex',
            KeyConditionExpression: 'urlId = :urlId',
            ExpressionAttributeValues: {
                ':urlId': urlId
            },
        }));

        // console.log(scanResponse.Items, "san response") 

        const items = scanResponse.Items || [];

        const getDistinctValues = (field: string) => {
            const values = new Set<string>();
            items.forEach(item => {
                if (item[field]) {
                    values.add(item[field]);
                }
            });
            return Array.from(values);
        };

        const distinctStats = {
            city: getDistinctValues('city'),
            country: getDistinctValues('country'),
            device: getDistinctValues('device'),
            browser: getDistinctValues('browser'),
            os: getDistinctValues('os'),
            referrer: getDistinctValues('referrer'),
            referralUrl: getDistinctValues('referralURL')
        };

        return event.json(distinctStats, 200);

    } catch (error) {
        console.error("Failed to fetch stats:", error);
        return event.text('Failed to fetch stats', 500);
    }
};