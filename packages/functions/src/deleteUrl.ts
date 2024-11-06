import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const deleteUrl = async (event: any) => {
    const urlId = event.req.param('id');

    try {
        await dynamoDb.send(new DeleteCommand({
            TableName: Resource.Urls.name,
            Key: {
                id: urlId,
            }
        }));

        return event.json({ message: 'URL deleted successfully' }, 200);
    } catch (error) {
        console.error(error);
        return event.text(error, 500);
    }
};