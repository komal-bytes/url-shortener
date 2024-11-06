import React, { useState, useEffect } from 'react';
import { Dropdown, Input, Card, Tab, DropdownMenu, DropdownSection, DropdownTrigger, Button, DropdownItem, Tabs, Breadcrumbs, BreadcrumbItem, Skeleton, Spinner } from '@nextui-org/react';
import { FiSearch } from 'react-icons/fi';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { BsWindows, BsApple, BsLinux } from 'react-icons/bs';
import { FaChrome, FaEdge, FaSafari } from 'react-icons/fa';
import { RiFlagLine } from 'react-icons/ri';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendRequest } from '@/utils/sendRequest';
import { toast } from 'react-toastify';
import Filter from '@/components/Stats/Filter';
import DateRange from '@/components/Stats/DateRange';
import DateRanger from '@/components/Stats/DateRange';
import { FaQuestionCircle } from "react-icons/fa";
import { Icon } from '@iconify/react';
import { FaMobileAlt, FaDesktop, FaTabletAlt } from "react-icons/fa";
import { LuMousePointerClick } from "react-icons/lu";
import SelectedFilters from '@/components/Stats/SelectedFilters';
import Graph from '@/components/Stats/Graph';

type ApiResponse = {
    browser: Record<string, number>;
    city: Record<string, number>;
    country: Record<string, number>;
    device: Record<string, number>;
    os: Record<string, number>;
    referrer: Record<string, number>;
    referralURL: Record<string, number>;
    totalClicks: number;
};

const Stats: React.FC = () => {

    interface FlagsMap {
        [countryName: string]: string;
    }
    const navigate = useNavigate();
    const [filter, setFilter] = useState<string>('');
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>('A');
    const [data, setData] = useState<ApiResponse | null>(null);
    const [filtersList, setFiltersList] = useState({});
    const [flags, setFlags] = useState<FlagsMap>({});
    const [selectedFilters, setSelectedFilters] = useState({});
    const [dataLoaded, setDataLoaded] = useState(false)
    const [time, setTime] = useState("All Time");
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);


    const path = useLocation().pathname.split('/');
    const urlId = path[path.length - 1];
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    useEffect(() => {
        fetchFiltersList()
    }, []);

    useEffect(() => {
        let params = {};
        Object.keys(selectedFilters).forEach((key) => {
            if (selectedFilters[key] != '') params[key] = selectedFilters[key];
        })
        console.log(time, "time")
        if (time) params.time = time;
        else {
            console.log("here")
            if (dateRange[0].startDate) params.startDate = dateRange[0].startDate;
            if (dateRange[0].endDate) params.endDate = dateRange[0].endDate;
        }

        fetchStats(params);
    }, [selectedFilters, time, dateRange]);

    const fetchStats = async (params: Object) => {
        try {
            setDataLoaded(false)
            const data = await sendRequest({ path: `stats/${urlId}`, method: "GET", queryParams: { ...params, timeZone } });
            console.log(data)
            setData(data);
            setDataLoaded(true)
        } catch (error: any) {
            toast.error(error);
        }
    };

    const fetchFiltersList = async () => {
        try {
            const data = await sendRequest({ path: `statsFilters/${urlId}`, method: "GET" });
            console.log(data)
            setFiltersList(data);
        } catch (error: any) {
            toast.error(error)
        }
    }

    const handleFilterKey = (e: KeyboardEvent) => {
        if (e.key === 'F') setFilter('');
        if (e.key === 'Escape') setFilter('');
    };

    useEffect(() => {
        window.addEventListener('keydown', handleFilterKey);
        return () => window.removeEventListener('keydown', handleFilterKey);
    }, []);


    const fetchFlags = async (): Promise<FlagsMap> => {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();

        // Map each country name to its flag URL
        const flagsMap: FlagsMap = {};
        countries.forEach((country: { name: { common: string }; flags: { svg: string } }) => {
            flagsMap[country.name.common] = country.flags.svg;
        });

        return flagsMap;
    };


    useEffect(() => {
        fetchFlags().then(setFlags);
    }, []);


    console.log(data)

    async function getCountryByCity(city) {
        const username = 'komal05';
        const geocodeUrl = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(city)}&username=${username}`;

        try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            if (data.geonames.length > 0) {
                const countryName = data.geonames[0].countryName; // Get country name
                return countryName; // Return the country name
            } else {
                throw new Error('City not found');
            }
        } catch (error) {
            console.error(error);
            return null; // Return null in case of error
        }
    }

    // console.log(getCountryByCity("Tokyo"))


    return (
        <div className="p-4">

            <div className='flex justify-between'>
                <Breadcrumbs>
                    <BreadcrumbItem
                        onClick={() => navigate('/analytics')}
                    >Analytics</BreadcrumbItem>
                    <BreadcrumbItem>{urlId}</BreadcrumbItem>
                </Breadcrumbs>
                <div className='flex items-center  space-x-3'>
                    {/* Filter Dropdown */}
                    <Filter filtersList={filtersList} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />

                    {/* Date Filter */}
                    <DateRanger time={time} setTime={setTime} dateRange={dateRange} setDateRange={setDateRange} />
                </div>

            </div>

            <div className='w-full flex items-center justify-between'>
                <SelectedFilters selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
                <div className='flex items-center text-2xl mt-2'><LuMousePointerClick />Total Clicks:  <span className='text-primary mx-2 font-bold'> {dataLoaded ? data?.totalClicks : <Spinner size="sm" />} </span></div>
            </div>


            {/* Graph Placeholder */}
            <Card className="shadow-none border-1 mt-4 mb-10">
                <Graph data={data?.data} />
            </Card>

            {/* Tabbed Containers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="shadow-none border-1 flex relative">
                    <Skeleton isLoaded={dataLoaded} className='h-full'>
                        <Tabs aria-label="Device Information" className='text-primary'
                            classNames={{
                                tabList: "gap-4 w-full relative rounded-none p-0 border-divider",
                                cursor: "w-full bg-primary",
                                tab: "max-w-fit px-0 h-[50px]",
                                tabContent: "group-data-[selected=true]:text-primary m-2"
                            }}
                            variant='underlined'
                        >

                            <Tab title="Device" className='max-h-[200px] overflow-y-scroll'>
                                {data?.device && Object.keys(data?.device).map((key) => {
                                    return <div className='flex items-center justify-between p-2'>
                                        <div className='flex items-center'>
                                            {key.toLowerCase() === "mobile" ? <FaMobileAlt /> : key.toLowerCase() === "desktop" ? <FaDesktop /> : key.toLowerCase() === "tablet" ? <FaTabletAlt /> : null}
                                            <p className='mx-2'>{key}</p>
                                        </div>
                                        <span>{data?.device[key]}</span>
                                    </div>
                                })}
                            </Tab>
                            <Tab title="Browser" className='max-h-[200px] overflow-y-scroll'>
                                {data?.browser && Object.keys(data?.browser).map((key) => {
                                    return <div className='flex items-center justify-between p-2'>
                                        <div className='flex items-center'>
                                            <Icon icon={`devicon:${key.toLowerCase()}`} width="20" height="20" />
                                            <p className='mx-2'>{key}</p>
                                        </div>
                                        <span>{data?.browser[key]}</span>
                                    </div>
                                })}
                            </Tab>
                            <Tab title="OS" className='max-h-[200px] overflow-y-scroll'>
                                {data?.os && Object.keys(data?.os).map((key) => {
                                    return <div className='flex items-center justify-between p-2'>
                                        <div className='flex items-center'>
                                            <Icon icon={`devicon:${key === "Windows" ? "windows11" : key.toLowerCase()}`} width="20" height="20" />
                                            <p className='mx-2'>{key}</p>
                                        </div>
                                        <span>{data?.os[key]}</span>
                                    </div>
                                })}
                            </Tab>
                        </Tabs>

                        <div className='absolute right-[10px] top-[18px] flex items-center'>
                            <LuMousePointerClick className='text-lg' />
                            <span className='mx-1 text-sm font-light'>Clicks</span>
                        </div>
                    </Skeleton>
                </Card>

                <Card className="shadow-none border-1 relative">
                    <Skeleton isLoaded={dataLoaded} className='h-full'>
                        <Tabs aria-label="Location Information"
                            className='text-primary'
                            classNames={{
                                tabList: "gap-4 w-full relative rounded-none p-0 border-divider",
                                cursor: "w-full bg-primary",
                                tab: "max-w-fit px-0 h-[50px]",
                                tabContent: "group-data-[selected=true]:text-primary m-2"
                            }}
                            variant='underlined'
                        >
                            <Tab title="City" className='max-h-[200px] overflow-y-scroll'>
                                {data?.city && Object.keys(data?.city).map((key) => {
                                    return <div className='flex items-center justify-between p-2'>
                                        <div className='flex items-center'>
                                            {key === "Unknown" && <FaQuestionCircle />}
                                            <p className='mx-2'>{key}</p>
                                        </div>
                                        <span>{data?.city[key]}</span>
                                    </div>
                                })}
                            </Tab>
                            <Tab title="Country" className='max-h-[200px] overflow-y-scroll'>
                                {data?.country && Object.keys(data?.country).map((key) => {
                                    return <div className='flex items-center justify-between p-2'>
                                        <div className='flex items-center'>
                                            {key === "Unknown" ? <FaQuestionCircle /> : <img src={flags[key]} alt={key} className='w-5' />}
                                            <p className='mx-2'>{key}</p>
                                        </div>
                                        <span>{data?.country[key]}</span>
                                    </div>
                                })}
                            </Tab>
                        </Tabs>

                        <div className='absolute right-[10px] top-[18px] flex items-center'>
                            <LuMousePointerClick className='text-lg' />
                            <span className='mx-1 text-sm font-light'>Clicks</span>
                        </div>
                    </Skeleton>
                </Card>

                <Card className="shadow-none border-1 relative">
                    <Skeleton isLoaded={dataLoaded} className='h-full'>
                        <Tabs aria-label="Referrer Information"
                            className='text-primary'
                            classNames={{
                                tabList: "gap-4 w-full relative rounded-none p-0 border-divider",
                                cursor: "w-full bg-primary",
                                tab: "max-w-fit px-0 h-[50px]",
                                tabContent: "group-data-[selected=true]:text-primary m-2"
                            }}
                            variant='underlined'
                        >
                            <Tab title="Referer" className='max-h-[200px] overflow-y-scroll'>
                                {data?.referrer && Object.keys(data?.referrer).map((key) => {
                                    return <div className='flex items-center justify-between p-2'>
                                        <p className='mx-2'>{key}</p>
                                        <span>{data?.referrer[key]}</span>
                                    </div>
                                })}
                            </Tab>
                            <Tab title="Referer URL" className='max-h-[200px] overflow-y-scroll'>
                                {data?.referralURL && Object.keys(data?.referralURL).map((key) => {
                                    return <div className='flex items-center justify-between p-2'>
                                        <p className='mx-2'>{key}</p>
                                        <span>{data?.referralURL[key]}</span>
                                    </div>
                                })}
                            </Tab>
                        </Tabs>

                        <div className='absolute right-[10px] top-[18px] flex items-center'>
                            <LuMousePointerClick className='text-lg' />
                            <span className='mx-1 text-sm font-light'>Clicks</span>
                        </div>
                    </Skeleton>
                </Card>
            </div>
        </div>
    );
};

export default Stats;