import React, { useEffect, useState } from "react";
import {
  Table,
  Modal,
  Button,
  Popover,
  Tooltip,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  PopoverTrigger,
  PopoverContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalContent,
  Spinner,
  Skeleton,
} from "@nextui-org/react";
import { AiOutlineCopy, AiOutlineShareAlt, AiOutlineMore } from "react-icons/ai";
import { BsTrash, BsQrCode, BsClipboardCheckFill } from "react-icons/bs";
import { sendRequest } from "@/utils/sendRequest"; // Assume this is your request function
import QRCode from "@/components/common/QRCode";
import {
  FaWhatsapp,
  FaTelegram,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";
import { ImStatsBars2 } from "react-icons/im";
import { FaSquareXTwitter } from "react-icons/fa6"
import { FiCopy } from "react-icons/fi";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

type UrlData = {
  id: string;
  name: string,
  originalUrl: string;
  shortUrl: string;
  clicks: number
};

const AnalyticsPage: React.FC = () => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<UrlData | null>(null);
  const [modalType, setModalType] = useState<"delete" | "share" | "qr" | null>(null);
  const [copied, setCopied] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [dataLoaded, setDataLoaded] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const data = await sendRequest({ path: "urls", method: "GET" });
      console.log(data.urls)
      setUrls(data.urls);
      setDataLoaded(true)
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleCopy = (url: Object) => {
    navigator.clipboard.writeText(url.shortUrl);
    setCopied(url?.id);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDelete = async () => {
    if (selectedUrl) {
      setDeleting(true)
      try {
        await sendRequest({ path: `deleteUrl/${selectedUrl.id}`, method: "DELETE" });
        fetchUrls()
        setModalType(null);
        toast.success("URL deleted successfully");
      } catch (error: any) {
        toast.error(error)
      }
    }

    onOpenChange()
    setDeleting(false)
  };

  const shareOnPlatform = (platformUrl: string) => {
    window.open(platformUrl, "_blank");
    setModalType(null);
  };


  return (
    <div className="p-4">
      <h1 className="text-3xl text-center font-semibold p-2">Analytics</h1>

      {
        urls.length === 0
          ?
          <div className="w-full h-full flex flex-col item-center justify-center my-10">
            <Spinner size="lg" />
            <p className="text-primary text-xl my-5 w-full text-center">Fetching Your Data</p>
          </div>
          :
          <Table aria-label="Analytics Table">
            <TableHeader>
              <TableColumn >Name</TableColumn>
              <TableColumn>Original URL</TableColumn>
              <TableColumn>Shortened URL</TableColumn>
              <TableColumn>Clicks</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {
                urls?.map((url) => (
                  <TableRow key={url.id}>
                    <TableCell>
                      <Tooltip content={url?.name}>
                        {`${url.name.substring(0, 25)}...`}
                      </Tooltip>
                    </TableCell>
                    <TableCell><a href={url.originalUrl} target="_blank" className="underline">{`${url.originalUrl.substring(0, 25)}...`}</a></TableCell>
                    <TableCell><a href={url.shortUrl} target="_blank" className="underline">{`${url.shortUrl.substring(0, 25)}...`}</a></TableCell>
                    <TableCell>{url.clicks}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-center">
                        <Tooltip content={copied === url.id ? "Copied" : "Copy"} color={copied ? "success" : "default"}>
                          <Button isIconOnly className='bg-transparent' onClick={() => handleCopy(url)}>
                            {copied === url.id ? <BsClipboardCheckFill className="text-xl text-green-500 cursor-pointer" /> : <FiCopy className="text-xl cursor-pointer" />}
                          </Button>
                        </Tooltip>
                        <AiOutlineShareAlt
                          onClick={() => {
                            setSelectedUrl(url);
                            setModalType("share");
                            onOpen()
                          }}
                          className="cursor-pointer text-xl"
                        />
                        <Popover placement="bottom" isOpen={popoverOpen === url.id}>
                          <PopoverTrigger>
                            <Button isIconOnly className='bg-transparent'
                              onClick={() => setPopoverOpen((prev) => (prev ? !popoverOpen : url.id))}
                            >
                              <AiOutlineMore className="cursor-pointer text-xl" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="flex flex-col p-2 space-y-2">
                              <Button
                                size="sm"
                                className="bg-red-400"
                                endContent={<BsTrash />}
                                onClick={() => {
                                  setSelectedUrl(url);
                                  setModalType("delete");
                                  onOpen()
                                  setPopoverOpen(false)
                                }}
                              >
                                Delete
                              </Button>
                              <Button
                                size="sm"
                                endContent={<BsQrCode />}
                                onClick={() => {
                                  setSelectedUrl(url);
                                  setModalType("qr");
                                  onOpen()
                                  setPopoverOpen(false)
                                }}
                              >
                                Generate QR
                              </Button>
                              <Button
                                size="sm"
                                endContent={<ImStatsBars2 />}
                                onClick={() => {
                                  navigate(`/analytics/${url?.id}`)
                                }}
                              >
                                Show Analytics
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableCell>
                  </TableRow>
                ))

              }
            </TableBody>
          </Table>

      }

      {/* Modal for various actions */}
      <Modal isOpen={isOpen} onOpenChange={() => {
        onOpenChange()
        setModalType(null)
      }}
      >
        <ModalContent>
          <ModalHeader>
            {modalType === "delete" ? "Confirm Deletion" : modalType === "share" ? "Share URL" : modalType === "qr" ? "QR Code" : ""}
          </ModalHeader>
          <ModalBody>
            {modalType === "delete" && (
              <>
                <p>{selectedUrl?.name}</p>
                <a href={selectedUrl?.shortUrl} target="_blank" className="text-sm underline">{selectedUrl?.shortUrl}</a>
                <p>Are you sure you want to delete this URL?</p>
              </>
            )}
            {modalType === "share" && selectedUrl && (
              <div className="flex gap-4 justify-center">
                <FaWhatsapp
                  className="cursor-pointer text-green-500 text-3xl"
                  onClick={() => shareOnPlatform(`https://wa.me/?text=${selectedUrl.shortenedUrl}`)}
                />
                <FaTelegram
                  className="cursor-pointer text-blue-400 text-3xl"
                  onClick={() => shareOnPlatform(`https://t.me/share/url?url=${selectedUrl.shortenedUrl}`)}
                />
                <FaEnvelope
                  className="cursor-pointer text-red-500 text-3xl"
                  onClick={() => shareOnPlatform(`mailto:?body=${selectedUrl.shortenedUrl}`)}
                />
                <FaFacebook
                  className="cursor-pointer text-blue-600 text-3xl"
                  onClick={() => shareOnPlatform(`https://www.facebook.com/sharer.php?u=${selectedUrl.shortenedUrl}`)}
                />
                <FaSquareXTwitter
                  className="cursor-pointer text-black text-3xl"
                  onClick={() => shareOnPlatform(`https://twitter.com/intent/tweet?url=${selectedUrl.shortenedUrl}`)}
                />
                <FaLinkedin
                  className="cursor-pointer text-blue-700 text-3xl"
                  onClick={() => shareOnPlatform(`https://www.linkedin.com/sharing/share-offsite/?url=${selectedUrl.shortenedUrl}`)}
                />
              </div>
            )}
            {modalType === "qr" && selectedUrl && (
              <div className="flex flex-col items-center gap-4">
                <p>Share this QR code:</p>
                <QRCode qrCodeUrl={selectedUrl.shortUrl} />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button size="sm" color="primary" onClick={() => {
              onOpenChange()
              setModalType(null)
            }}>
              Close
            </Button>
            {modalType === "delete" && (
              <Button size="sm" className="bg-red-400" onClick={handleDelete}>
                {deleting ? <Spinner size="sm" color="default" /> : "Delete"}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
};

export default AnalyticsPage;
