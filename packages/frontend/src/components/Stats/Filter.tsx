import { Button } from '@nextui-org/button'
import { Input, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { TiArrowRight } from "react-icons/ti";
import { IoFilterOutline } from "react-icons/io5";

interface props {
    filtersList: [],
    selectedFilters: Object,
    setSelectedFilters: Function
}
const Filter: React.FC<props> = ({ filtersList, selectedFilters, setSelectedFilters }) => {

    const [list, setList] = useState(Object.keys(filtersList))
    const [subList, setSubList] = useState([]);
    const [key, setKey] = useState("")
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState("");

    const updateList = (key: string) => {
        console.log(filtersList[key], key)
        setKey(key)
        setSubList(filtersList[key])
        setSelectedFilters((prev) => {
            return {
                ...prev,
                [key]: ""
            }
        })
    }

    const updateSelectedFilters = (value: string) => {
        setSelectedFilters((prev) => {
            return {
                ...prev,
                [key]: value
            }
        })
        setIsOpen(false)
        setSubList([])
    }

    console.log(selectedFilters)

    useEffect(() => {
        setList(Object.keys(filtersList))
    }, [filtersList])


    function filterArrayByString(str: string) {
        const lowerStr = str.toLowerCase().trim();
        if (subList.length > 0) {
            if (lowerStr.length === 0) return setSubList(filtersList[key])
            let res = subList.filter(item => item.toLowerCase().includes(lowerStr));
            setSubList(res)
        } else {
            if (lowerStr.length === 0) return setList(Object.keys(filtersList))
            let res = list.filter(item => item.toLowerCase().includes(lowerStr));
            setList(res)
        }
    }

    ////////LATERRRR
    // const handleEscKey = (event: any) => {
    //     if (event.key === "Escape") {
    //         console.log("ESC key was pressed!");
    //         if (subList.length > 0) setSubList([])
    //         else setList([])
    //     }
    // };

    // useEffect(() => {
    //     document.addEventListener("keydown", handleEscKey);
    //     return () => {
    //         document.removeEventListener("keydown", handleEscKey);
    //     };
    // }, []);

    const resetFilters = () => {
        setList(Object.keys(filtersList))
        setSubList([])
        setSelectedFilters({})
    }

    const goBack = () => {
        if (subList.length > 0) setSubList([]);
        else {
            setIsOpen(false)
            setList(Object.keys(filtersList));
            setSelectedFilters({})
        }
    }

    return (
        <div>
            <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                <PopoverTrigger>
                    <Button size="md" className='text-md rounded-[5px] font-light'>
                        <IoFilterOutline />
                        Filter</Button>
                </PopoverTrigger>
                <PopoverContent className='p-2'>
                    <Input placeholder='Search' onChange={(e) => filterArrayByString(e.target.value)}
                        endContent={<TiArrowRight className='text-xl cursor-pointer' onClick={goBack} />}
                    />
                    <div className="px-1 py-2 w-full">
                        {

                            subList.length === 0 ? list?.map((key) => {
                                return <div className="text-small text-left p-2 w-full cursor-pointer"
                                    onClick={() => updateList(key)}
                                >{key.toUpperCase()}</div>
                            })
                                :
                                subList?.map((item) => {
                                    return <div className="text-small text-left p-2 w-full cursor-pointer"
                                        onClick={() => updateSelectedFilters(item)}
                                    >{item.toUpperCase()}</div>
                                })
                        }
                    </div>
                </PopoverContent>
            </Popover>

            {/* <Button onClick={resetFilters}>Clear Filter</Button> */}

            {/* {
                Object.keys(selectedFilters)?.map((key) => {

                    return selectedFilters[key] ?
                        <div>{key} is {selectedFilters[key]}</div>
                        :
                        <></>
                })
            } */}

        </div >
    )
}

export default Filter