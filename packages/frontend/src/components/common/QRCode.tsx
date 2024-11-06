import React, { useState } from 'react'
import { FiCopy, FiCheck, FiShare2, FiMail, FiLoader } from 'react-icons/fi';
import { FaQrcode, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import { BsClipboardCheckFill } from "react-icons/bs";
import { Tooltip } from '@nextui-org/react';

interface props {
    qrCodeUrl: string,
}

const QRCode: React.FC<props> = ({ qrCodeUrl }) => {

    const [qrCopied, setQrCopied] = useState(false);

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

    const handleShareImage = () => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        if (canvas) {
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], 'QRCode.png', { type: 'image/png' });
                    const shareData = {
                        files: [file],
                        title: 'Check out this QR Code',
                        text: 'Here is a QR code for the link: ' + qrCodeUrl,
                    };

                    navigator.share(shareData).catch((error) => {
                        console.error('Error sharing:', error);
                    });
                }
            });
        }
    };

    return (
        <div className="flex flex-col items-center space-y-3">
            <QRCodeCanvas value={qrCodeUrl} size={150} />
            <div className="flex space-x-2 mt-2">
                <Tooltip content={qrCopied ? "Copied!" : "Copy QR Code"} color={qrCopied ? "success" : "default"}>
                    <div onClick={handleCopyQRImage} className='cursor-pointer'>
                        {qrCopied ? <BsClipboardCheckFill className="w-5 h-5 text-green-500" /> : <FiCopy className="w-5 h-5" />}
                    </div>
                </Tooltip>
                {/* <a
                    href={`mailto:?subject=Check%20this%20link&body=Here's%20a%20link%20you%20might%20find%20interesting:%20${qrCodeUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FiMail className="w-5 h-5 text-red-500" onClick={handleShareImage} />
                </a> */}
                <FaWhatsapp className="w-5 h-5 text-green-500 cursor-pointer" onClick={handleShareImage} />
                <FaTelegram className="w-5 h-5 text-blue-500 cursor-pointer" onClick={handleShareImage} />
            </div>
        </div>
    )
}

export default QRCode