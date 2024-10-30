import React, { useEffect, useState } from "react";
import axios from "axios";

const Index: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [customUrl, setCustomUrl] = useState<string>("");

  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);

  console.log(import.meta.env.VITE_API_URL)
  const baseUrl = import.meta.env.VITE_API_URL;

  const handleShorten = async () => {
    if (!url) {
      alert("Please enter a URL.");
      return;
    }

    try {
      let body = { url };
      if (customUrl) body = { ...body, customUrl };

      const response = await axios.post(`${baseUrl}shorten`, body);
      setShortenedUrl(response.data.shortUrl);
    } catch (error) {
      console.error("Error shortening the URL:", error);
      alert("Failed to shorten the URL. Please try again.");
    }
  };

  const handleFetchOriginalUrl = async (shortenedUrl: string) => {
    const urlParts = shortenedUrl.split('/');
    const id = urlParts[urlParts.length - 1];
    try {
      const response = await axios.get(`${baseUrl}urls/${id}`);
      const urls = await axios.get(`${baseUrl}urls`);
      console.log(urls)
      // window.open(response.data.url, '_blank');
    } catch (error) {
      console.error("Error fetching the original URL:", error);
      alert("Failed to fetch the original URL. Please try again.");
    }
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">URL Shortener</h1>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Enter URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button
          onClick={handleShorten}
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
        >
          Shorten It
        </button>
      </div>

      <input
        type="text"
        placeholder="Enter custom short URL here..."
        value={customUrl}
        onChange={(e) => setCustomUrl(e.target.value)}
        className="border rounded p-2 w-full"
      />

      {shortenedUrl && (
        <div className="mt-4">
          <p>Shortened URL:</p>
          <a
            href="#"
            onClick={() => handleFetchOriginalUrl(shortenedUrl)}
            className="text-blue-600 underline"
          >
            {shortenedUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default Index;
