/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { ImageUploader } from "@/services/ImageUploader";
import { TBlog } from "@/types";

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blogData: TBlog) => void;
  blog: TBlog | null;
  isLoading: boolean;
}

const inputCls =
  "w-full px-3 py-2 rounded-lg bg-[#161b27] border border-white/[0.08] text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-50 transition-colors";

const labelCls = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5";

const BlogFormModal = ({ isOpen, onClose, onSave, blog, isLoading }: BlogFormModalProps) => {
  const [formData, setFormData] = useState({ title: "", description: "", coverImage: "", status: "DRAFT" });

  useEffect(() => {
    if (isOpen) {
      if (blog) {
        setFormData({ title: blog.title, description: blog.description, coverImage: blog.coverImage || "", status: blog.status || "DRAFT" });
      } else {
        setFormData({ title: "", description: "", coverImage: "", status: "DRAFT" });
      }
    }
  }, [blog, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as any);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl m-4 rounded-2xl border border-white/[0.08] bg-[#0d1117] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold text-white">
            {blog ? "Edit Blog Post" : "Create Blog Post"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Cover Image */}
          <div>
            <label className={labelCls}>Cover Image</label>
            <ImageUploader
              onUploadSuccess={(url) => setFormData((p) => ({ ...p, coverImage: url }))}
              initialImageUrl={formData.coverImage}
            />
            {!formData.coverImage && (
              <p className="text-amber-500/80 text-xs mt-1">Cover image is required.</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className={labelCls}>Title</label>
            <input
              placeholder="Blog post title"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              required
              disabled={isLoading}
              className={inputCls}
            />
          </div>

          {/* Content */}
          <div>
            <label className={labelCls}>Content / Description</label>
            <textarea
              placeholder="Write your blog content here..."
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              required
              disabled={isLoading}
              rows={6}
              className={inputCls + " resize-none"}
            />
          </div>

          {/* Status */}
          <div className="w-1/2">
            <label className={labelCls}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
              disabled={isLoading}
              className={inputCls}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-white/[0.06] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.coverImage}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading && <Loader2 size={14} className="animate-spin" />}
              {blog ? "Save Changes" : "Publish Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogFormModal;
