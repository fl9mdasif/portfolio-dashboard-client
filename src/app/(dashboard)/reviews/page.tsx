/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { PlusCircle, Loader2, Star, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { TReview } from "@/types";
import {
  useGetAllReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/redux/api/reviewApi";
import ReviewFormModal from "./ReviewFormModal";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={13}
        className={s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-700 fill-slate-700"}
      />
    ))}
  </div>
);

const ReviewsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<TReview | null>(null);

  const { data: reviews, isLoading } = useGetAllReviewsQuery({});
  // const reviews: TReview[] = reviewsData?.data ?? [];

  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const handleOpenCreate = () => { setEditingReview(null); setIsModalOpen(true); };
  const handleOpenEdit = (review: TReview) => { setEditingReview(review); setIsModalOpen(true); };
  const handleClose = () => { setIsModalOpen(false); setEditingReview(null); };

  const handleSave = async (data: TReview) => {
    const payload = { ...data };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    try {
      if (editingReview?._id) {
        await updateReview({ id: editingReview._id, data: payload }).unwrap();
        toast.success("Review updated!");
      } else {
        await createReview(payload).unwrap();
        toast.success("Review created!");
      }
      handleClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to save review.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(id).unwrap();
      toast.success("Review deleted.");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete review.");
    }
  };

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <Star className="w-5 h-5 text-rose-400" />
            </div>
            Reviews
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} · {reviews.filter((r: any) => r.isPublished).length} published
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-lg shadow-rose-900/30"
        >
          <PlusCircle size={16} />
          Add Review
        </button>
      </div>

      <div className="h-px bg-gradient-to-r from-rose-500/20 via-white/[0.06] to-transparent" />

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] overflow-hidden">
        {reviews.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-rose-400" />
            </div>
            <p className="text-slate-300 font-medium">No reviews yet</p>
            <p className="text-slate-500 text-sm mt-1">Click Add Review to add a testimonial.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Reviewer</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Rating</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Comment</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Status</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Date</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {reviews.map((review: TReview) => (
                  <tr key={review._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-200">{review.userName}</p>
                      {review.userTitle && (
                        <p className="text-xs text-slate-500 mt-0.5">{review.userTitle}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <StarRating rating={review.rating} />
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <p className="text-slate-400 text-xs line-clamp-2">{review.comment}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      {review.isPublished ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <CheckCircle size={12} /> Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <XCircle size={12} /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{formatDate(review.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(review)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 transition-colors"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => review._id && handleDelete(review._id)}
                          disabled={isDeleting}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        review={editingReview}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default ReviewsPage;
