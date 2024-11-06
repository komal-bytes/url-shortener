// import React, { useEffect, useState } from 'react';
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer,
// } from 'recharts';

// interface GraphProps {
//     data: Record<string, number>;
// }

// const Graph: React.FC<GraphProps> = ({ data }) => {

//     const [chartData, setChartData] = useState([])

//     useEffect(() => {
//         if (!data) return;
//         let arr = Object.keys(data).map((key) => ({
//             name: key,
//             clicks: data[key],
//         }));
//         setChartData(arr)
//     }, [data])

//     return (
//         <div className="w-full h-96 p-4 rounded-lg shadow-md">
//             <ResponsiveContainer width="100%" height="100%">
//                 <LineChart
//                     data={chartData}
//                     margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//                 >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
//                     <YAxis tick={{ fill: '#6b7280' }} />
//                     <Tooltip />
//                     <Line
//                         type="monotone"
//                         dataKey="clicks"
//                         stroke="#4f46e5"
//                         fillOpacity={0.3}
//                         fill="#4f46e5"
//                         strokeWidth={2}
//                     />
//                 </LineChart>
//             </ResponsiveContainer>
//         </div>
//     );
// };

// export default Graph;


import { Spinner } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    TooltipProps,
} from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

interface GraphProps {
    data: Record<string, number>;
}

const Graph: React.FC<GraphProps> = ({ data }) => {
    // Convert object format to array format
    const [chartData, setChartData] = useState([])
    const [loading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!data) return;
        let arr = Object.keys(data).map((key) => ({
            name: key,
            clicks: data[key],
        }));
        setChartData(arr)
        setIsLoading(false)
    }, [data])

    // Custom Tooltip to match style
    const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-lg rounded-md p-2 text-sm text-gray-700">
                    <p className="font-semibold">{label}</p>
                    <p>
                        <span className="text-blue-600">Clicks: </span> {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-96 p-4 rounded-lg shadow-md">
            <ResponsiveContainer width="100%" height="100%">
                {
                    loading
                        ?
                        <div className='h-full flex items-center justify-center'>
                            <Spinner size='lg' />
                        </div>
                        :
                        <LineChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="clicks"
                                stroke="#3b82f6" // Blue color for the line
                                strokeWidth={2}
                                dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 3 }} // Small dots on the line
                                activeDot={{ r: 5 }} // Larger dot on hover
                                fillOpacity={0.3}
                                fill="url(#colorUv)"
                            />
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                        </LineChart>
                }

            </ResponsiveContainer>
        </div>
    );
};

export default Graph;
