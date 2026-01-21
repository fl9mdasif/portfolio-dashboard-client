"use client";

import { TProject } from "@/types"; // Import TProjectStatus too
import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react"; // Import Loader2 // Adjust path if needed
import { ImageUploader } from "@/app/components/UI/ImageUploader";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: TProject) => void;
  project: TProject | null;
  isLoading: boolean; // **[NEW]** Prop to indicate loading state
}

// Reusable UI Components (Keep your Input, Textarea, Select components as they are)
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full p-2 bg-secondary border rounded-lg text-text-main border-border focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className="w-full p-2 bg-secondary border rounded-lg text-text-main border-border focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
    rows={4}
  />
);

const Select = (
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    children: React.ReactNode;
  },
) => (
  <select
    {...props}
    className="w-full p-2 bg-secondary border rounded-lg text-text-main border-border focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
  />
);

const ProjectFormModal = ({
  isOpen,
  onClose,
  onSave,
  project,
  isLoading, // **[NEW]** Destructure isLoading
}: ProjectFormModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    category: "Full Stack",
    image: "", // Initialize image as empty string
    gallery: "",
    status: "In Development", // Use the specific type
    liveUrl: "",
    githubClient: "",
    githubServer: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setFormData({
          title: project.title,
          description: project.description,
          technologies: project.technologies.join(", "),
          category: project.category,
          image: project.image || "",
          gallery: project.gallery?.join("\n") || "",
          status: project.status || "In Development",
          liveUrl: project.liveUrl || "",
          githubClient: project.githubClient || "",
          githubServer: project.githubServer || "",
        });
      } else {
        setFormData({
          title: "",
          description: "",
          technologies: "",
          category: "Full Stack",
          image: "",
          gallery: "",
          status: "In Development",
          liveUrl: "",
          githubClient: "",
          githubServer: "",
        });
      }
    }
  }, [project, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent submission if already loading

    const projectData: TProject = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: formData.status || "Live",
      image: formData.image,
      liveUrl: formData.liveUrl || undefined, // Send undefined if empty
      githubClient: formData.githubClient || undefined, // Send undefined if empty
      githubServer: formData.githubServer || undefined, // Send undefined if empty
      technologies: formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      gallery: formData.gallery
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
      createdAt: "",
      updatedAt: "",
    };
    onSave(projectData);
  };

  // **[MODIFIED]** Re-enabled image validation
  // const isFormValid =
  //   formData.title &&
  //   formData.technologies &&
  //   formData.image && // Check if image URL exists
  //   formData.category;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-3xl p-6 m-4 overflow-y-auto border rounded-lg shadow-xl bg-primary border-border max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {project ? "Edit Project" : "Create New Project"}
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Uploader */}
          <div>
            <label className="block mb-1 text-sm font-medium text-text-secondary">
              Main Project Image
            </label>

            <ImageUploader
              onUploadSuccess={handleImageUpload}
              initialImageUrl={formData.image}
            />

            {/* Simple validation message */}
            {!formData.image && (
              <p className="text-red-500 text-xs mt-1">Image is required.</p>
            )}
          </div>

          {/* Title & Description */}
          <Input
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
          <Textarea
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />

          {/* Category & Status */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-text-secondary">
                Category
              </label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                <option>Full Stack</option>
                <option>Frontend</option>
                <option>Backend</option>
                <option>Mobile App</option>
                <option>AI</option>
                <option>Tool</option>
              </Select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-text-secondary">
                Status
              </label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                <option>In Development</option>
                <option>Completed</option>
                <option>Live</option>
                <option>On Hold</option>
              </Select>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block mb-1 text-sm font-medium text-text-secondary">
              Technologies (comma-separated)
            </label>
            <Input
              name="technologies"
              placeholder="Next.js, TypeScript, Tailwind CSS"
              value={formData.technologies}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* Image Gallery */}
          <div>
            <label className="block mb-1 text-sm font-medium text-text-secondary">
              Image Gallery (one URL per line, optional)
            </label>
            <Textarea
              name="gallery"
              placeholder="https://.../image1.png&#10;https://.../image2.png"
              value={formData.gallery}
              onChange={handleInputChange}
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
            {/* **[NEW]** Added Labels */}
            <div>
              <label className="block mb-1 text-sm font-medium text-text-secondary">
                GitHub Client URL (optional)
              </label>
              <Input
                name="githubClient"
                placeholder="https://github.com/..."
                value={formData.githubClient}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-text-secondary">
                GitHub Server URL (optional)
              </label>
              <Input
                name="githubServer"
                placeholder="https://github.com/..."
                value={formData.githubServer}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium text-text-secondary">
                Live URL (optional)
              </label>
              <Input
                name="liveUrl"
                placeholder="https://..."
                value={formData.liveUrl}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-secondary text-text-main hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              // **[MODIFIED]** Updated styles & disabled logic
              // disabled={!isFormValid || isLoading}
              className="flex items-center justify-center px-4 py-2 font-semibold text-white rounded-lg bg-green-500 hover:bg-accent-hover"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading
                ? project
                  ? "Saving..."
                  : "Creating..."
                : "Save Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
