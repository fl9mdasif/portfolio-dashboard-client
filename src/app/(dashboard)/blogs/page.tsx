/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// [১] আপনার API Slice থেকে Blog Hooks ইম্পোর্ট করুন

import { TBlog } from "@/types";
import {
  useCreateBlogMutation,
  useGetAllBlogsQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "@/redux/api/blogApi";
import BlogTable from "./BlogTable";
import BlogFormModal from "./BlogFormModal";

const BlogsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<TBlog | null>(null);

  // Fetch blogs using RTK Query
  const { data: blogs, refetch, isLoading } = useGetAllBlogsQuery({});
  //   const blogs = blogsData?.data;

  //   console.log(blogsData);

  // Mutation hooks
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const handleOpenModalForCreate = () => {
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (blog: TBlog) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleSaveBlog = async (blogFormData: Partial<TBlog>) => {
    const payload = { ...blogFormData };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;

    try {
      if (editingBlog?._id) {
        // UPDATE Logic
        await updateBlog({
          id: editingBlog._id,
          data: payload,
        }).unwrap();
        toast.success("Blog updated successfully!");
      } else {
        // CREATE Logic
        await createBlog(payload).unwrap();
        toast.success("Blog created successfully!");
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save blog.");
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog([blogId]).unwrap();
        toast.success("Blog deleted successfully!");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete blog.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="w-16 h-16 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex text-secondary/80 px-5 py-4 items-center justify-between mb-1">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
        <button
          onClick={handleOpenModalForCreate}
          className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors rounded-lg bg-accent hover:bg-accent-hover"
        >
          <PlusCircle size={20} />
          Add New Blog
        </button>
      </div>

      <div className="p-6 border rounded-lg border-border">
        <BlogTable
          refetch={refetch}
          blogs={blogs || []}
          onEdit={handleOpenModalForEdit}
          onDelete={handleDeleteBlog}
        />
      </div>

      <BlogFormModal
        isLoading={isCreating || isUpdating || isDeleting}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBlog}
        blog={editingBlog}
      />
    </div>
  );
};

export default BlogsPage;
