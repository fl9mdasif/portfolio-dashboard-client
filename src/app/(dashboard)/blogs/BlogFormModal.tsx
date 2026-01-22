/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { ImageUploader } from "@/app/components/UI/ImageUploader";
import { TBlog } from "@/types";

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blogData: TBlog) => void;
  blog: TBlog | null;
  isLoading: boolean;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full p-2 bg-white text-black border rounded-lg text-text-main border-border focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className="w-full p-2 bg-white text-black border rounded-lg text-text-main border-border focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
    rows={6}
  />
);

const Select = (
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    children: React.ReactNode;
  },
) => (
  <select
    {...props}
    className="w-full p-2 bg-white text-black border rounded-lg text-text-main border-border focus:outline-none focus:ring-2 focus:ring-accent"
  />
);

const BlogFormModal = ({
  isOpen,
  onClose,
  onSave,
  blog,
  isLoading,
}: BlogFormModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    status: "DRAFT",
  });

  useEffect(() => {
    if (isOpen) {
      if (blog) {
        setFormData({
          title: blog.title,
          description: blog.description,
          coverImage: blog.coverImage || "",
          status: blog.status || "DRAFT",
        });
      } else {
        setFormData({
          title: "",
          description: "",
          coverImage: "",
          status: "DRAFT",
        });
      }
    }
  }, [blog, isOpen]);

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, coverImage: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as any);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="w-full max-w-2xl p-6 m-4 overflow-y-auto border rounded-lg shadow-xl bg-primary border-border max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {blog ? "Edit Blog" : "Create Blog"}
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-text-secondary">
              Blog Cover Image
            </label>

            <ImageUploader
              onUploadSuccess={handleImageUpload}
              initialImageUrl={formData.coverImage}
            />

            {/* Simple validation message */}
            {!formData.coverImage && (
              <p className="text-red-500 text-xs mt-1">Image is required.</p>
            )}
          </div>

          <Input
            placeholder="Blog Title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />

          <Textarea
            placeholder="Blog Content / Description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />

          <div className="w-1/2">
            <label className="block mb-1 text-sm font-medium text-text-secondary">
              Status
            </label>
            <Select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </Select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 font-semibold text-white rounded-lg bg-green-500 hover:bg-accent-hover"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {blog ? "Update Blog" : "Create Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogFormModal;
