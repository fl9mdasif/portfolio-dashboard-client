/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { PlusCircle, Loader2, Newspaper, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { TBlog } from "@/types";
import {
  useCreateBlogMutation,
  useGetAllBlogsQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "@/redux/api/blogApi";
import BlogFormModal from "./BlogFormModal";
import Image from "next/image";

const statusStyle: Record<string, string> = {
  PUBLISHED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  DRAFT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  ARCHIVED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const BlogsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<TBlog | null>(null);

  const { data: blogs, refetch, isLoading } = useGetAllBlogsQuery({});
  // const blogs: TBlog[] = blogData?.data ?? [];

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const handleOpenCreate = () => { setEditingBlog(null); setIsModalOpen(true); };
  const handleOpenEdit = (blog: TBlog) => { setEditingBlog(blog); setIsModalOpen(true); };
  const handleClose = () => { setIsModalOpen(false); setEditingBlog(null); };

  const handleSave = async (data: Partial<TBlog>) => {
    const payload = { ...data };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    try {
      if (editingBlog?._id) {
        await updateBlog({ id: editingBlog._id, data: payload }).unwrap();
        toast.success("Blog updated!");
      } else {
        await createBlog(payload).unwrap();
        toast.success("Blog created!");
      }
      handleClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to save blog.");
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await deleteBlog(blogId).unwrap();
      toast.success("Blog deleted.");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete blog.");
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Newspaper className="w-5 h-5 text-violet-400" />
            </div>
            Blogs
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {blogs.length} post{blogs.length !== 1 ? "s" : ""} · {blogs.filter((b) => b.status === "PUBLISHED").length} published
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors shadow-lg shadow-violet-900/30"
        >
          <PlusCircle size={16} />
          New Post
        </button>
      </div>

      <div className="h-px bg-gradient-to-r from-violet-500/20 via-white/[0.06] to-transparent" />

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] overflow-hidden">
        {blogs.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
              <Newspaper className="w-6 h-6 text-violet-400" />
            </div>
            <p className="text-slate-300 font-medium">No blog posts yet</p>
            <p className="text-slate-500 text-sm mt-1">Click "New Post" to write your first article.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Blog Post</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Status</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Date</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {blogs.map((blog: TBlog) => (
                  <tr key={blog._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {blog.coverImage ? (
                          <Image src={blog.coverImage} alt={blog.title} width={56} height={40}
                            className="w-14 h-10 object-cover rounded-lg border border-white/10 flex-shrink-0" />
                        ) : (
                          <div className="w-14 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                            <Newspaper size={14} className="text-slate-600" />
                          </div>
                        )}
                        <p className="font-medium text-slate-200 max-w-xs truncate">{blog.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle[blog.status ?? ""] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                        {blog.status ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{formatDate(blog.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleOpenEdit(blog) && refetch()}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 transition-colors" title="Edit">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => blog._id && handleDelete(blog._id)} disabled={isDeleting}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50" title="Delete">
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

      <BlogFormModal
        isLoading={isCreating || isUpdating || isDeleting}
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        blog={editingBlog}
      />
    </div>
  );
};

export default BlogsPage;
