import { Button } from '@nextui-org/button'
import { DatePicker, DateRangePicker, Input, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { TiArrowRight } from "react-icons/ti";
import { DateRange } from 'react-date-range';
import { MdOutlineDateRange } from "react-icons/md";
import { useTheme } from '@/hooks/use-theme';

interface props {
    time: string,
    setTime: Function,
    dateRange: [],
    setDateRange: Function
}
const DateRanger: React.FC<props> = ({ time, setTime, dateRange, setDateRange }) => {

    // const { theme } = useTheme()
    const [isOpen, setIsOpen] = useState(false);
    const [timeList, setTimeList] = useState([
        "All Time",
        "Last 24 hours",
        "Last 7 days",
        "Last 30 days",
        "Last 3 months",
        "Last 12 months"
    ])

    const handleSelect = (ranges: []) => {
        console.log(ranges)
        setTime("")
        setDateRange([ranges.selection]);
        // setIsOpen(false)
    };

    function formatGMTDate(gmtDate: string): string {
        const date = new Date(gmtDate);

        if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
        }

        const options: Intl.DateTimeFormatOptions = {
            month: 'short',  // e.g., "Nov"
            day: 'numeric',  // e.g., "4"
            year: 'numeric', // e.g., "2024"
        };

        // Format the date using the specified options
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }




    return (
        <div>
            <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                <PopoverTrigger>
                    <Button size="md" className='text-md rounded-[5px] font-light'>
                        <MdOutlineDateRange />
                        {time ? time : `${formatGMTDate(dateRange[0].startDate)} - ${formatGMTDate(dateRange[0]?.endDate)}`}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full'>
                    <div className="flex w-[500px]">
                        <DateRange
                            ranges={dateRange}
                            onChange={handleSelect}
                            moveRangeOnFirstSelection={false}
                        />

                        <div className='w-1/3 pl-3'>
                            {
                                timeList?.map((time) => {
                                    return <div className={`text-small text-left p-2 w-full cursor-pointer hover:bg-gray-300`}
                                        onClick={() => { setTime(time); setIsOpen(false) }}
                                    >{time}</div>
                                })
                            }
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

        </div>
    )
}

export default DateRanger;