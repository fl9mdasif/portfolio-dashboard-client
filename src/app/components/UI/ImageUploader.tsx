/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { UploadCloud, X, Loader2 } from "lucide-react";
// import toast from "react-hot-toast";
// import Image from "next/image";

// interface ImageUploaderProps {
//   onUploadSuccess: (url: string) => void;
//   initialImageUrl?: string;
// }

// export const ImageUploader = ({
//   onUploadSuccess,
//   initialImageUrl,
// }: ImageUploaderProps) => {
//   const [isUploading, setIsUploading] = useState(false);
//   const [preview, setPreview] = useState(initialImageUrl || "");

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // ১. ফর্ম ডেটা তৈরি
//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       setIsUploading(true);
//       const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

//       // ২. imgBB API-তে POST রিকোয়েস্ট
//       const response = await axios.post(
//         `https://api.imgbb.com/1/upload?key=${apiKey}`,
//         formData,
//       );

//       if (response.data.success) {
//         const imageUrl = response.data.data.display_url;
//         setPreview(imageUrl);
//         onUploadSuccess(imageUrl); // মেইন ফর্মে URL পাঠিয়ে দেওয়া
//         toast.success("Image uploaded successfully!");
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       toast.error("Failed to upload image.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const removeImage = () => {
//     setPreview("");
//     onUploadSuccess("");
//   };

//   return (
//     <div className="space-y-2">
//       {preview ? (
//         <div className="relative w-full h-48 border rounded-lg overflow-hidden border-border group">
//           <Image
//             width={100}
//             height={100}
//             src={preview}
//             alt="Preview"
//             className="w-full h-full object-cover"
//           />
//           <button
//             type="button"
//             onClick={removeImage}
//             className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
//           >
//             <X size={16} />
//           </button>
//         </div>
//       ) : (
//         <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg border-border bg-secondary hover:bg-border cursor-pointer transition-colors">
//           {isUploading ? (
//             <div className="flex flex-col items-center">
//               <Loader2 className="w-8 h-8 animate-spin text-accent" />
//               <p className="mt-2 text-sm text-text-secondary">
//                 Uploading to imgBB...
//               </p>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center">
//               <UploadCloud className="w-8 h-8 text-text-secondary" />
//               <p className="mt-2 text-sm text-text-secondary">
//                 Click to upload image
//               </p>
//             </div>
//           )}
//           <input
//             type="file"
//             className="hidden"
//             onChange={handleFileChange}
//             disabled={isUploading}
//             accept="image/*"
//           />
//         </label>
//       )}
//     </div>
//   );
// };

"use client";

import { useState } from "react";
import axios from "axios";
import { UploadCloud, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  initialImageUrl?: string;
}

export const ImageUploader = ({
  onUploadSuccess,
  initialImageUrl,
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(initialImageUrl || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ১. ফর্ম ডেটা তৈরি করুন
    const formData = new FormData();
    formData.append("image", file);

    // [TRICK] নির্দিষ্ট ফোল্ডারের মতো করে নাম সেট করা
    // এখানে নামের শুরুতে 'portfolio-server-' যোগ করা হয়েছে যাতে সহজে খুঁজে পাওয়া যায়
    formData.append("name", `portfolio-server-${file.name}`);

    try {
      setIsUploading(true);
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

      // ২. imgBB API-তে POST রিকোয়েস্ট পাঠান
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
      );

      if (response.data.success) {
        const imageUrl = response.data.data.display_url;
        setPreview(imageUrl);
        onUploadSuccess(imageUrl);
        toast.success("Image uploaded successfully!");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.error?.message || "Failed to upload image.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setPreview("");
    onUploadSuccess("");
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative w-full h-48 border rounded-lg overflow-hidden border-border group">
          <Image
            height={80}
            width={100}
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg border-border bg-secondary hover:bg-border cursor-pointer transition-colors">
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <p className="mt-2 text-sm text-text-secondary">
                Uploading to portfolio-server...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud className="w-8 h-8 text-text-secondary" />
              <p className="mt-2 text-sm text-text-secondary">
                Click to upload image
              </p>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
            accept="image/*"
          />
        </label>
      )}
    </div>
  );
};
