"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Star } from "lucide-react";
import { TReview } from "@/types";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TReview) => void;
  review: TReview | null;
  isLoading: boolean;
}

const inputCls =
  "w-full px-3 py-2 rounded-lg bg-[#161b27] border border-white/[0.08] text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 disabled:opacity-50 transition-colors";

const labelCls = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5";

const ReviewFormModal = ({ isOpen, onClose, onSave, review, isLoading }: ReviewFormModalProps) => {
  const [formData, setFormData] = useState({
    userName: "",
    userTitle: "",
    rating: 5,
    comment: "",
    isPublished: false,
  });

  useEffect(() => {
    if (isOpen) {
      if (review) {
        setFormData({
          userName: review.userName,
          userTitle: review.userTitle ?? "",
          rating: review.rating,
          comment: review.comment,
          isPublished: review.isPublished ?? false,
        });
      } else {
        setFormData({ userName: "", userTitle: "", rating: 5, comment: "", isPublished: false });
      }
    }
  }, [review, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onSave({ ...formData, rating: Number(formData.rating) } as TReview);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md m-4 rounded-2xl border border-white/[0.08] bg-[#0d1117] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold text-white">
            {review ? "Edit Review" : "Add New Review"}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User Name */}
          <div>
            <label className={labelCls}>Reviewer Name</label>
            <input
              name="userName"
              placeholder="e.g. John Smith"
              value={formData.userName}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={inputCls}
            />
          </div>

          {/* User Title */}
          <div>
            <label className={labelCls}>Title / Role <span className="text-slate-600 normal-case">(optional)</span></label>
            <input
              name="userTitle"
              placeholder="e.g. CTO at Acme Corp"
              value={formData.userTitle}
              onChange={handleChange}
              disabled={isLoading}
              className={inputCls}
            />
          </div>

          {/* Rating */}
          <div>
            <label className={labelCls}>
              Rating —{" "}
              <span className="text-amber-400 normal-case flex items-center gap-0.5 ">
                {Array.from({ length: formData.rating }).map((_, i) => (
                  <Star key={i} size={12} className="fill-amber-400" />
                ))}
              </span>
            </label>
            <div className="flex items-center gap-2 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, rating: star }))}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={24}
                    className={
                      star <= formData.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-700 fill-slate-700"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className={labelCls}>Comment</label>
            <textarea
              name="comment"
              placeholder="Write the client's testimonial here..."
              value={formData.comment}
              onChange={handleChange}
              required
              disabled={isLoading}
              rows={4}
              className={inputCls + " resize-none"}
            />
          </div>

          {/* Is Published */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              disabled={isLoading}
              className="w-4 h-4 rounded accent-teal-500"
            />
            <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
              Publish on portfolio
            </span>
          </label>

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
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading && <Loader2 size={14} className="animate-spin" />}
              {isLoading ? (review ? "Saving..." : "Creating...") : review ? "Save Changes" : "Add Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewFormModal;
