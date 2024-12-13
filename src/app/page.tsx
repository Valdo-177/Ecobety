"use client";

import { useState } from "react";
import axios from "axios";

function HomePage() {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ result_url: string }>({ result_url: '' });

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await convertToBase64(e.target.files[0]);
      setImage(base64);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const base64 = await convertToBase64(e.dataTransfer.files[0]);
      setImage(base64);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modelImage || !garmentImage) {
      alert("Both images are required.");
      return;
    }

    setLoading(true);

    try {
      const API_KEY = "sk_8d93e4f7eb0849de958c72dc5c3c966a";
      const response = await axios.post(
        "https://api.developer.pixelcut.ai/v1/try-on",
        {
          person_image_url: modelImage,
          garment_image_url: garmentImage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-API-KEY": API_KEY,
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 h-screen flex justify-center items-center">
      <form onSubmit={onSubmit} className="bg-zinc-900 p-10 w-3/12">
        <h1 className="text-2xl font-bold text-slate-200 mb-5">
          Virtual Try-On
        </h1>

        <div
          className="p-4 border-dashed border-2 border-gray-500 rounded-md mb-4 cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, setModelImage)}
        >
          <p className="text-white text-center">
            {modelImage ? "Model Image Uploaded" : "Drag or Select Model Image"}
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setModelImage)}
            className="hidden"
          />
        </div>

        <div
          className="p-4 border-dashed border-2 border-gray-500 rounded-md mb-4 cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, setGarmentImage)}
        >
          <p className="text-white text-center">
            {garmentImage
              ? "Garment Image Uploaded"
              : "Drag or Select Garment Image"}
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setGarmentImage)}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 p-2 rounded-md block mt-2 disabled:opacity-50 text-white"
          disabled={loading || !modelImage || !garmentImage}
        >
          {loading ? "Processing..." : "Submit"}
        </button>

        {result && (
          <div className="mt-4 text-white">
            <h2 className="text-lg font-bold">Result:</h2>
            <pre className="text-sm bg-gray-800 p-2 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        {result && (
          <div className="mt-4 text-white">
            <h2 className="text-lg font-bold">Result:</h2>
            <a href={result.result_url} target="_blank" rel="noopener noreferrer">
              <img
                src={result.result_url}
                alt="Try-On Result"
                className="mt-2 rounded"
              />
            </a>
          </div>
        )}
      </form>
    </div>
  );
}

export default HomePage;