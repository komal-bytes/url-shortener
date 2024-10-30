import React, { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { useLocation } from 'react-router-dom';

const Confirm: React.FC = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false)
    const location = useLocation();

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
        // css={{ textAlign: 'center' }}
        >
            <p className="mb-4">{message}</p>
            <Button
                onClick={() => window.open("/")}
                color="primary">
                {error ? "Create Account" : "Log in"}
            </Button>
        </div >
    );
};

export default Confirm;
