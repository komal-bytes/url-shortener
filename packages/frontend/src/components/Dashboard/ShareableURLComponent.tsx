import React, { useState } from 'react';
import { Tooltip, Button, Spinner, Input } from '@nextui-org/react';
import { FiCopy, FiCheck, FiShare2, FiMail, FiLoader } from 'react-icons/fi';
import { FaQrcode, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import { BsClipboardCheckFill } from "react-icons/bs";
import QRCode from '../common/QRCode';

interface props {
    shortenedUrl: string
}

const ShareableURLComponent: React.FC<props> = ({ shortenedUrl }) => {
    // const [shortenedUrl] = useState("https://short.ly/example"); // Replace with actual shortened URL
    const [copied, setCopied] = useState(false);
    const [generatingQR, setGeneratingQR] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [qrImageUrl, setQrImageUrl] = useState<string | number | boolean>(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(shortenedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleGenerateQR = () => {
        setGeneratingQR(true);
        setTimeout(() => {
            setQrCodeUrl(shortenedUrl);
            setGeneratingQR(false);
            const canvas = document.querySelector('canvas') as HTMLCanvasElement;
            if (canvas) {
                const qrCodeImage = canvas.toDataURL("image/png");
                setQrImageUrl(qrCodeImage);
            }
        }, 1500);
    };


    return (
        <div className="py-4 rounded-md text-center space-y-4 w-full">

            <Input
                fullWidth
                isRequired={true}
                value={shortenedUrl}
                readOnly
                endContent={
                    <div className='flex space-x-2'>
                        <Tooltip content={copied ? "Copied!" : "Copy URL"} color={copied ? "success" : "default"}>
                            <Button isIconOnly className='bg-transparent' onClick={handleCopy}>
                                {copied ? <BsClipboardCheckFill className="w-5 h-5 text-green-500 cursor-pointer" /> : <FiCopy className="w-5 h-5 cursor-pointer" />}
                            </Button>
                        </Tooltip>
                        <Tooltip content="Generate QR Code">
                            <Button isIconOnly className='bg-transparent' onClick={handleGenerateQR}>
                                {generatingQR ? <Spinner size="sm" /> : <FaQrcode className="w-5 h-5 cursor-pointer" />}
                            </Button>
                        </Tooltip>
                    </div>
                }
            />

            {
                qrCodeUrl
                &&
                <QRCode qrCodeUrl={qrCodeUrl} />
            }

        </div>
    );
};

export default ShareableURLComponent;
