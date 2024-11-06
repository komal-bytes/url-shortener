import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { addDays, subHours, subMonths, format, subDays, addMonths } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { Resource } from 'sst';
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// Converts an IST date string to UTC Date object
const convertISTToUTC = (dateStr: string) => {
    const dateIST = new Date(dateStr);
    // return zonedTimeToUtc(dateIST, 'Asia/Kolkata');
    return new Date(dateStr).toISOString();
};

// Generates date ranges based on `time` parameter
const getDateRangeFromTime = (time: string, createdAt: Date): { startDate: Date; endDate: Date } | null => {
    const now = new Date();

    switch (time) {
        case 'Last 24 hours':
            return { startDate: subHours(now, 24), endDate: now };
        case 'Last 7 days':
            return { startDate: subDays(now, 7), endDate: now };
        case 'Last 30 days':
            return { startDate: subDays(now, 30), endDate: now };
        case 'Last 3 months':
            return { startDate: subMonths(now, 3), endDate: now };
        case 'Last 12 months':
            return { startDate: subMonths(now, 12), endDate: now };
        case 'All Time':
            return { startDate: new Date(createdAt), endDate: now };
        default:
            return null;
    }
};

// Builds a filter expression for query parameters
const buildFilterExpression = (params: Record<string, string>) => {
    const expressions: string[] = [];
    const values: Record<string, any> = {};
    const names: Record<string, any> = {};

    Object.keys(params).forEach((key) => {
        if (params[key]) {
            expressions.push(`#${key} = :${key}`);
            values[`:${key}`] = params[key];
            names[`#${key}`] = key;
        }
    });

    // console.log(names, "names")

    return {
        FilterExpression: expressions.length ? expressions.join(' AND ') : undefined,
        // ExpressionAttributeNames: expressions.length ? Object.fromEntries(Object.keys(values).map((key) => [`#${key}`, key])) : undefined,
        ExpressionAttributeNames: expressions.length ? names : undefined,
        ExpressionAttributeValues: expressions.length ? values : undefined,
    };
};

// Fetches analytics data from DynamoDB with the applied filters
const fetchAnalyticsData = async (urlId: string, params: Record<string, string>, startDate?: Date, endDate?: Date) => {
    const filterExpression = buildFilterExpression(params);

    let expressionAttributeValues: Record<string, any> = {
        ':urlId': urlId,
    };
    // ////////////////////////////////

    // Define createdAt condition if both startDate and endDate are provided
    let dateFilterExpression = '';
    if (startDate && endDate) {
        dateFilterExpression = '#timestamp BETWEEN :startDate AND :endDate';
        expressionAttributeValues[':startDate'] = new Date(startDate).toISOString();
        expressionAttributeValues[':endDate'] = new Date(endDate).toISOString();
    } else if (startDate) {
        dateFilterExpression = '#timestamp >= :startDate';
        expressionAttributeValues[':startDate'] = new Date(startDate).toISOString();
    }
    // else if (endDate) {
    //     dateFilterExpression = '#createdAt <= :endDate';
    //     expressionAttributeValues[':endDate'] = endDate.toISOString();
    // }

    // Define ExpressionAttributeNames
    const expressionAttributeNames = {
        '#timestamp': 'timestamp',
        ...filterExpression.ExpressionAttributeNames,
    };

    // Combine date filter expression with other filters, if any
    const combinedFilterExpression = [
        dateFilterExpression,
        filterExpression.FilterExpression,
    ].filter(Boolean).join(' AND ');


    if (filterExpression.ExpressionAttributeValues) {
        expressionAttributeValues = { ...expressionAttributeValues, ...filterExpression.ExpressionAttributeValues }
    }

    // console.log(expressionAttributeNames, "hey1")
    // console.log(expressionAttributeValues, "hey2")
    // console.log(combinedFilterExpression, "hey3")

    const queryCommand = new QueryCommand({
        TableName: Resource.Analytics?.name,
        IndexName: 'urlIdIndex',
        KeyConditionExpression: 'urlId = :urlId',
        FilterExpression: combinedFilterExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: {
            ...expressionAttributeValues,
        },
    });

    // ////////////////////////////////

    // const queryCommand = new QueryCommand({
    //     TableName: Resource.Analytics?.name,
    //     IndexName: 'urlIdIndex',
    //     KeyConditionExpression: 'urlId = :urlId',
    //     ...filterExpression,
    //     ExpressionAttributeValues: {
    //         ':urlId': urlId,
    //         ...filterExpression.ExpressionAttributeValues,
    //         ...(startDate && { ':startDate': startDate.toISOString() }),
    //         ...(endDate && { ':endDate': endDate.toISOString() }),
    //     },
    // });
    // console.log(queryCommand)
    const response = await dynamoDb.send(queryCommand);
    // console.log(response, "respone")
    return response.Items || [];
};

// const processAnalyticsData = async (items: any[], time: string, createdAt: Date) => {

//     const data: Record<string, number> = {};
//     const stats = {
//         browser: {} as Record<string, number>,
//         device: {} as Record<string, number>,
//         os: {} as Record<string, number>,
//         city: {} as Record<string, number>,
//         country: {} as Record<string, number>,
//         referrer: {} as Record<string, number>,
//         referralURL: {} as Record<string, number>,
//     };

//     // console.log(items, "items")

//     items.forEach((item) => {
//         const date = formatDateByTime(time, createdAt);
//         // console.log(date)
//         data[date] = (data[date] || 0) + 1;
//         ['browser', 'device', 'os', 'city', 'country', 'referrer', 'referralURL'].forEach((field) => {
//             const value = item[field];
//             if (value) stats[field][value] = (stats[field][value] || 0) + 1;
//         });
//     });

//     return { totalClicks: items.length, data, ...stats };
// };

// const formatDateByTime = (time: string, createdAt: Date): string => {
//     // const date = utcToZonedTime(new Date(createdAt), 'Asia/Kolkata');
//     const date = new Date(createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//     switch (time) {
//         case 'Last 24 hours':
//             return format(date, 'ha');
//         case 'Last 7 days':
//         case 'Last 30 days':
//             return format(date, 'yyyy-MM-dd');
//         case 'Last 3 months':
//         case 'Last 12 months':
//             return format(date, 'MMMM yyyy');
//         case 'All Time':
//             return format(date, 'MMMM yyyy');
//         default:
//             return format(date, 'yyyy-MM-dd');
//     }
// };

/////////Important//////////

// const processAnalyticsData = async (items: any[], time: string, createdAt: Date, finalStartDate: Date, finalEndDate: Date) => {
//     const data: Record<string, number> = {};
//     const stats = {
//         browser: {} as Record<string, number>,
//         device: {} as Record<string, number>,
//         os: {} as Record<string, number>,
//         city: {} as Record<string, number>,
//         country: {} as Record<string, number>,
//         referrer: {} as Record<string, number>,
//         referralURL: {} as Record<string, number>,
//     };

//     const initializeData = () => {
//         const now = new Date();

//         switch (time) {
//             case 'All Time':
//                 // Start from createdAt's month/year till current month/year
//                 let date = new Date(createdAt);
//                 while (date <= now) {
//                     const monthYear = format(date, 'MMMM yyyy');
//                     data[monthYear] = 0;
//                     date = addMonths(date, 1);
//                 }
//                 break;
//             case 'Last 24 hours':
//                 for (let i = 0; i < 24; i++) {
//                     const hour = format(subHours(now, i), 'h:00 a');
//                     data[hour] = 0;
//                 }
//                 break;
//             case 'Last 7 days':
//                 for (let i = 0; i < 7; i++) {
//                     const day = format(subDays(now, i), 'EEEE');
//                     data[day] = 0;
//                 }
//                 break;
//             case 'Last 30 days':
//                 for (let i = 0; i < 30; i++) {
//                     const day = format(subDays(now, i), 'dd/MM/yyyy');
//                     data[day] = 0;
//                 }
//                 break;
//             case 'Last 3 months':
//                 for (let i = 0; i < 90; i++) {
//                     const day = format(subDays(now, i), 'dd/MM/yyyy');
//                     data[day] = 0;
//                 }
//                 break;
//             case 'Last 12 months':
//                 for (let i = 0; i < 12; i++) {
//                     const month = format(subMonths(now, i), 'MMMM');
//                     data[month] = 0;
//                 }
//                 break;
//         }
//     };

//     const matchDataKey = (itemDate: Date): string | null => {
//         switch (time) {
//             case 'All Time':
//                 return format(itemDate, 'MMMM yyyy');
//             case 'Last 24 hours':
//                 return format(itemDate, 'h:00 a');
//             case 'Last 7 days':
//                 return format(itemDate, 'EEEE');
//             case 'Last 30 days':
//             case 'Last 3 months':
//                 return format(itemDate, 'dd/MM/yyyy');
//             case 'Last 12 months':
//                 return format(itemDate, 'MMMM');
//             default:
//                 return null;
//         }
//     };

//     initializeData();

//     console.log(data, "data")

//     items.forEach((item) => {
//         const itemDate = new Date(item.timestamp); // assuming item.createdAt is the timestamp
//         console.log(itemDate, "date")
//         const key = matchDataKey(itemDate);
//         console.log(key, "key")
//         if (key && data[key] !== undefined) {
//             data[key] += 1;
//         }

//         ['browser', 'device', 'os', 'city', 'country', 'referrer', 'referralURL'].forEach((field) => {
//             const value = item[field];
//             if (value) stats[field][value] = (stats[field][value] || 0) + 1;
//         });
//     });

//     return { totalClicks: items.length, data, ...stats };
// };

//////Importmat /////////////

const processAnalyticsData = async (items: any[], time: string, createdAt: Date, finalStartDate: Date, finalEndDate: Date, timeZone: string) => {
    let data: Record<string, number> = {};
    const stats = {
        browser: {} as Record<string, number>,
        device: {} as Record<string, number>,
        os: {} as Record<string, number>,
        city: {} as Record<string, number>,
        country: {} as Record<string, number>,
        referrer: {} as Record<string, number>,
        referralURL: {} as Record<string, number>,
    };

    const initializeData = () => {
        const now = new Date(new Date().toLocaleString(undefined, { timeZone }));
        switch (time) {
            case 'All Time':
                // Start from createdAt's month/year till current month/year
                let date = new Date(new Date(createdAt).toLocaleString(undefined, { timeZone }));
                while (date <= now) {
                    const monthYear = format(date, 'MMMM yyyy');
                    data[monthYear] = 0;
                    date = addMonths(date, 1);
                }
                break;
            case 'Last 24 hours': {
                data = getLast24Hours(timeZone)
                break;
            }
            case 'Last 7 days': {
                data = getLast7Days(timeZone)
                break;
            }
            case 'Last 30 days': {
                for (let i = 29; i >= 0; i--) {
                    const day = format(subDays(now, i), 'dd/MM/yyyy');
                    data[day] = 0;
                }
                break;
            }
            case 'Last 3 months': {
                for (let i = 89; i >= 0; i--) {
                    const day = format(subDays(now, i), 'dd/MM/yyyy');
                    data[day] = 0;
                }
                break;
            }
            case 'Last 12 months': {
                data = getLast12Months(timeZone)
                break;
            }
            default: {
                const currentDate = new Date(new Date(finalStartDate).toLocaleString(undefined, { timeZone }));
                while ((currentDate).getTime() <= new Date(finalEndDate).getTime()) {
                    const dateStr = format(currentDate, 'dd/MM/yyyy');
                    data[dateStr] = 0;
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                break;
            }
        }
    };

    const matchDataKey = (itemDate: Date): string | null => {
        switch (time) {
            case 'All Time':
                return format(itemDate, 'MMMM yyyy');
            case 'Last 24 hours':
                return format(itemDate, 'h:00 a');
            case 'Last 7 days':
                return format(itemDate, 'EEEE');
            case 'Last 30 days':
            case 'Last 3 months':
                return format(itemDate, 'dd/MM/yyyy');
            case 'Last 12 months':
                return format(itemDate, 'MMMM yyyy');
            default:
                return format(itemDate, 'dd/MM/yyyy');
        }
    };

    initializeData();

    console.log(data, "data 369");
    // return;

    items.forEach((item) => {
        const itemDate = new Date(new Date(item.timestamp).toLocaleString(undefined, { timeZone }));

        if (time === "Last 24 hours") {
            const date = format(itemDate, "dd/MM/yyyy, h:00 a");
            const time = format(itemDate, "h:00 a");
            if (date && data[date] && data[date]?.main == time) {
                data[date].clicks += 1;
            }

        } else if (time === "Last 7 days") {
            const key = format(itemDate, 'dd/MM/yyyy');
            if (key && data[key]) {
                data[key].clicks += 1;
            }
        } else {
            const key = matchDataKey(itemDate);
            if (key && data[key] !== undefined) {
                data[key] += 1;
            }
        }

        ['browser', 'device', 'os', 'city', 'country', 'referrer', 'referralURL'].forEach((field) => {
            const value = item[field];
            if (value) stats[field][value] = (stats[field][value] || 0) + 1;
        });
    });

    // console.log("line 399")
    if (time === "Last 7 days" || time === "Last 24 hours") {
        // console.log(time, "Line 401")
        let obj = {}
        Object.keys(data).forEach((key) => {
            // console.log(data[key]?.main, data[key]?.clicks, "404")
            obj[data[key].main] = data[key]?.clicks;
        })

        data = obj;
    }

    return { totalClicks: items.length, data, ...stats };
};

// API endpoint to get stats based on urlId and optional filters
export const getStats = async (event: any) => {
    try {

        const urlId = event.req.param('id');
        const queries = event.req.query();
        const { device, browser, os, city, country, referrer, referralURL, time, startDate, endDate, timeZone } = queries;
        // Convert `startDate` and `endDate` to UTC if provided
        const utcStartDate = startDate ? convertISTToUTC(startDate) : undefined;
        const utcEndDate = endDate ? convertISTToUTC(endDate) : undefined;

        const getParams = {
            TableName: Resource.Urls.name,
            Key: { id: urlId },
        };

        const url = await dynamoDb.send(new GetCommand(getParams));

        // Calculate date range if `time` is specified
        const dateRange = time ? getDateRangeFromTime(time, url?.Item?.createdAt) : null;
        const finalStartDate = utcStartDate || dateRange?.startDate;
        const finalEndDate = utcEndDate || dateRange?.endDate;

        // Fetch analytics data from DynamoDB
        const params = { device, browser, os, city, country, referrer, referralURL };
        const items = await fetchAnalyticsData(urlId, params, finalStartDate, finalEndDate);
        console.log("reached here")
        // Process the data to fit the response format
        const result = await processAnalyticsData(items, time, url?.Item?.createdAt, finalStartDate, finalEndDate, timeZone);

        // console.log(queries, "queries");

        console.log(result.data, "result");

        return event.json(result, 200);
    } catch (error) {
        return event.text(error, 500)
    }

};

const getLast12Months = (timeZone: string): Record<string, number> => {
    const months = {};
    const now = new Date().toLocaleString(undefined, { timeZone });

    for (let i = 11; i >= 0; i--) {
        const date = subMonths(now, i);
        const month = (format(date, 'MMMM yyyy'));
        months[month] = 0;
    }

    return months;
};

const getLast24Hours = (timeZone: string): Record<string, { time: string; clicks: number }> => {
    const hours: Record<string, { time: string; clicks: number }> = {};
    const now = new Date().toLocaleString(undefined, { timeZone });

    for (let i = 23; i >= 0; i--) {
        const hourDate = subHours(now, i);
        // const localizedDate = new Date(hourDate.toLocaleString('en-US', { timeZone }));
        // console.log(hourDate, "hourDate")
        const dateKey = format(hourDate, 'dd/MM/yyyy, h:00 a'); // Date in "dd/MM/yyyy" format
        const time = format(hourDate, 'h:00 a'); // Time in "hh:mm AM/PM" format

        hours[dateKey] = { main: time, clicks: 0 };
    }

    return hours;
};

const getLast7Days = (timeZone: string): Record<string, { date: string; clicks: number }> => {
    const days: Record<string, { date: string; clicks: number }> = {};
    const now = new Date().toLocaleString(undefined, { timeZone });
    // const currentDayIndex = now.getDay();
    console.log(now, "index")
    for (let i = 6; i >= 0; i--) {
        const date = subDays(now, i);
        // console.log(date)
        const dayName = format(date, 'EEEE'); // Day name (e.g., "Tuesday")
        days[format(date, 'dd/MM/yyyy')] = {
            main: dayName, // Date format (e.g., "11/05/2024")
            clicks: 0,
        };
    }

    return days;
};
