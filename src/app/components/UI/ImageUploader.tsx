"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UploadCloud, Image as ImageIcon, X, Loader2 } from "lucide-react";
import clsx from "clsx";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  initialImageUrl?: string; // To show existing image when editing
}

export const ImageUploader = ({
  onUploadSuccess,
  initialImageUrl = "",
}: ImageUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const localPreviewUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(localPreviewUrl);
    } else if (selectedFile) {
      toast.error("Please select a valid image file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    const loadingToast = toast.loading("Starting upload...");

    try {
      // Step 1: Request a pre-signed URL from your server
      const { data: presignData } = await axios.post("/api/upload", {
        filename: file.name,
        contentType: file.type,
      });

      const { uploadUrl, fileUrl } = presignData;

      // Step 2: Upload the file directly to S3 using the pre-signed URL
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          setProgress(percentCompleted);
          toast.loading(`Uploading... ${percentCompleted}%`, {
            id: loadingToast,
          });
        },
      });

      onUploadSuccess(fileUrl); // Notify parent component
      setPreviewUrl(fileUrl); // Show the final S3 URL as the preview
      setFile(null); // Clear the file buffer
      toast.success("Image uploaded successfully!", { id: loadingToast });
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.", { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
    onUploadSuccess(""); // Notify parent that image has been removed
  };

  // Drag and Drop Handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter} // DragOver is needed to make Drop work
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          "relative flex flex-col items-center justify-center w-full p-4 transition-colors border-2 border-dashed rounded-lg border-border",
          {
            "border-accent bg-accent/10": isDragging,
            "bg-primary/30": !isDragging,
          }
        )}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Image preview"
              className="object-cover w-full h-40 rounded-md"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="text-center">
            <UploadCloud className="w-10 h-10 mx-auto text-text-secondary" />
            <p className="mt-2 text-sm text-text-secondary">
              <label
                htmlFor="file-upload"
                className="font-semibold cursor-pointer text-accent hover:underline"
              >
                Click to upload
              </label>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-text-secondary">PNG, JPG, or GIF</p>
          </div>
        )}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) =>
            handleFileChange(e.target.files ? e.target.files[0] : null)
          }
          className="hidden"
        />
      </div>

      {isUploading && (
        <div className="w-full mt-2 bg-secondary rounded-full h-2.5">
          <div
            className="bg-accent h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {file && !isUploading && (
        <button
          onClick={handleUpload}
          className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-2 font-bold text-white transition-colors rounded-lg bg-green-600 hover:bg-green-700"
        >
          <UploadCloud size={20} />
          Upload to S3
        </button>
      )}
    </div>
  );
};
