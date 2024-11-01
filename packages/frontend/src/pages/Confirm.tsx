import React, { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { MdOutlineErrorOutline } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';

const Confirm: React.FC = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.slice(1)); // Slice(1) to remove leading '#'
        const errorCode = params.get('error_code');
        const errorDescription = params.get('error_description');

        if (errorCode && errorCode.startsWith('4')) {
            // If there's a 4xx error, display expiration message
            setMessage('Confirm Link expired. Try creating the account again.');
            setError(true)
        } else {
            // If no error, display success message
            setMessage('Email confirmed successfully.');
            setError(false)
        }
    }, []);

    return (
        <div
            className="flex flex-col justify-center items-center text-center min-h-screen bg-gray-50"
        >
            {error ? <MdOutlineErrorOutline className='text-red-500 text-[100px] mb-4' /> : <GiConfirmed className='text-green-500 text-[100px] mb-4' />}
            <p className="mb-4 text-2xl">{message}</p>
            <Button
                className='text-lg'
                onClick={() => navigate("/")}
                color="primary">
                {error ? "Create Account" : "Visit Site"}
            </Button>
        </div >
    );
};

export default Confirm;
