// src/hooks/useSnackbar.ts
import { useState } from 'react';

export const useSnackbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('')

    const openSnackbar = (msg: string, msgType: string) => {
        setMessage(msg);
        setType(msgType)
        setIsOpen(true);
    };

    const closeSnackbar = () => {
        setIsOpen(false);
    };

    return {
        isOpen,
        message,
        type,
        openSnackbar,
        closeSnackbar,
    };
};
