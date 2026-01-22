"use client";

import { TBlog } from "@/types";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

interface BlogTableProps {
  blogs: TBlog[];
  refetch: () => void;
  onEdit: (blog: TBlog) => void;
  onDelete: (blogId: string) => void;
}

const BlogTable = ({ onEdit, blogs, onDelete }: BlogTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (blogs.length === 0) {
    return (
      <div className="text-center py-10 text-text-secondary">
        No blogs found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-text-secondary">
        <thead className="text-xs uppercase bg-secondary text-text-secondary">
          <tr>
            <th className="px-6 py-3">Blog Title</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr
              key={blog._id}
              className="border-b bg-primary/60 hover:bg-secondary/20 hover:text-black border-border hover transition-colors"
            >
              <td className="px-6 py-4 font-medium ">
                <div className="flex items-center gap-4">
                  <Image
                    src={blog.coverImage || ""}
                    alt={blog.title}
                    width={60}
                    height={50}
                    className="w-14 h-10 object-cover rounded"
                  />
                  <span className="truncate max-w-xs">{blog.title}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${blog.status === "PUBLISHED" ? "bg-green-700 text-white" : "bg-yellow-600 text-white"}`}
                >
                  {blog.status}
                </span>
              </td>
              <td className="px-6 py-4">{formatDate(blog.createdAt)}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => onEdit(blog)}
                    className="text-green-500 hover:text-green-400"
                  >
                    <Edit className="text-[#33ff00]" size={18} />
                  </button>
                  <button
                    onClick={() => blog._id && onDelete(blog._id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="text-[#d80000]" size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogTable;
