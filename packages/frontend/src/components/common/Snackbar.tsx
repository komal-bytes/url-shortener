// src/components/Snackbar.tsx
import React, { useEffect } from 'react';

interface SnackbarProps {
    message: string;
    type: string;
    duration?: number;
    onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type, duration = 6000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`fixed bottom-5 left-2/3 animate-slide ${type === "success" ? "bg-green-500" : "bg-red-500"} text-white text-center px-4 py-2 rounded-md shadow-lg max-w-[350px]`}>
            <p>{message}</p>
        </div>
    );
};

export default Snackbar;
