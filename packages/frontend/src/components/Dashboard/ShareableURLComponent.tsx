import React, { useState } from 'react';
import { Tooltip, Button, Spinner, Input } from '@nextui-org/react';
import { FiCopy, FiCheck, FiShare2, FiMail, FiLoader } from 'react-icons/fi';
import { FaQrcode, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import { BsClipboardCheckFill } from "react-icons/bs";

interface props {
    shortenedUrl: string
}

const ShareableURLComponent: React.FC<props> = ({ shortenedUrl }) => {
    // const [shortenedUrl] = useState("https://short.ly/example"); // Replace with actual shortened URL
    const [copied, setCopied] = useState(false);
    const [generatingQR, setGeneratingQR] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [qrCopied, setQrCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(shortenedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000); // Reset after 3 seconds
    };

    const handleGenerateQR = () => {
        setGeneratingQR(true);
        setTimeout(() => {
            setQrCodeUrl(shortenedUrl); // Generate QR code from URL
            setGeneratingQR(false);
        }, 1500); // Simulating QR code generation delay
    };

    const handleCopyQRImage = () => {
        if (qrCodeUrl) {
            const canvas = document.querySelector('canvas') as HTMLCanvasElement;
            if (canvas) {
                canvas.toBlob((blob) => {
                    const item = new ClipboardItem({ 'image/png': blob! });
                    navigator.clipboard.write([item]);
                    setQrCopied(true);
                    setTimeout(() => setQrCopied(false), 3000); // Reset after 3 seconds
                });
            }
        }
    };

    const handleWebShare = () => {
        if (navigator.share) {
            navigator.share({
                title: "Check out this link",
                text: "Here's a link you might find interesting!",
                url: shortenedUrl,
            });
        } else {
            alert("Web Share API is not supported on this browser.");
        }
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

            {qrCodeUrl && (
                <div className="flex flex-col items-center space-y-3">
                    <QRCodeCanvas value={qrCodeUrl} size={150} />
                    <div className="flex space-x-2 mt-2">
                        <Tooltip content={qrCopied ? "Copied!" : "Copy QR Code"} color={qrCopied ? "success" : "default"}>
                            <div onClick={handleCopyQRImage} className='cursor-pointer'>
                                {qrCopied ? <BsClipboardCheckFill className="w-5 h-5 text-green-500" /> : <FiCopy className="w-5 h-5" />}
                            </div>
                        </Tooltip>
                        <a
                            href={`mailto:?subject=Check%20this%20link&body=Here's%20a%20link%20you%20might%20find%20interesting:%20${shortenedUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FiMail className="w-5 h-5 text-red-500" />
                        </a>
                        <a href={`https://wa.me/?text=${encodeURIComponent(shortenedUrl)}`} target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className="w-5 h-5 text-green-500" />
                        </a>
                        <a href={`https://t.me/share/url?url=${encodeURIComponent(shortenedUrl)}`} target="_blank" rel="noopener noreferrer">
                            <FaTelegram className="w-5 h-5 text-blue-500" />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareableURLComponent;
