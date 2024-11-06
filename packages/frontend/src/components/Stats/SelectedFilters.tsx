// components/SelectedFilters.tsx

import React from 'react';
import { AiOutlineGlobal, AiOutlineMobile } from 'react-icons/ai';
import { BsBrowserSafari } from 'react-icons/bs';
import { MdLocationCity, MdDevices } from 'react-icons/md';
import { FaTwitter } from 'react-icons/fa';
import { SiApple } from 'react-icons/si';
import { IoIosClose } from "react-icons/io";
import { GrSystem } from "react-icons/gr";
import { RiExternalLinkFill } from "react-icons/ri";
import { FaLink } from "react-icons/fa6";

interface SelectedFiltersProps {
    selectedFilters: {
        country?: string;
        city?: string;
        browser?: string;
        os?: string;
        device?: string;
        referer?: string;
        referrerURL?: string;
    };
    setSelectedFilters: Function
}

const icons = {
    country: <AiOutlineGlobal />,
    city: <MdLocationCity />,
    browser: <BsBrowserSafari />,
    os: <GrSystem />,
    device: <AiOutlineMobile />,
    referrer: <RiExternalLinkFill />,
    referralUrl: <FaLink />, // Assuming Twitter icon for t.co
};

const SelectedFilters: React.FC<SelectedFiltersProps> = ({ selectedFilters, setSelectedFilters }) => {

    console.log(selectedFilters)
    return (
        <div className="flex flex-wrap gap-3 p-4 rounded-md w-2/3">
            {Object.keys(selectedFilters).map((key) => (
                <div
                    key={key}
                    className="flex items-center px-3 py-1.5 border border-gray-300 rounded-full shadow-sm"
                >
                    {icons[key as keyof typeof icons] && (
                        <span className="mr-2 text-primary">{icons[key as keyof typeof icons]}</span>
                    )}
                    <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span className="mx-1">is</span>
                    <span>{selectedFilters[key]}</span>
                    <IoIosClose className='text-xl cursor-pointer'
                        onClick={() => {
                            setSelectedFilters((prev) => {
                                let list = delete selectedFilters[key];
                                return list;
                            })
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default SelectedFilters;
