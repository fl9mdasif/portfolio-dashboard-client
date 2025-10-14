"use client";

import { TProject } from "@/types"; // Adjust this import path to where you saved your interface
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ImageUploader } from "@/app/components/UI/ImageUploader";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: TProject) => void;
  project: TProject | null;
}

// Reusable UI Components with consistent styling
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full p-2 bg-secondary border rounded-lg text-text-main border-border focus:outline-none focus:ring-2 focus:ring-accent"
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className="w-full p-2 bg-secondary border rounded-lg text-text-main border-border focus:outline-none focus:ring-2 focus:ring-accent"
  />
);

const Select = (
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    children: React.ReactNode;
  }
) => (
  <select
    {...props}
    className="w-full p-2 bg-secondary border rounded-lg text-text-main border-border focus:outline-none focus:ring-2 focus:ring-accent"
  />
);

const ProjectFormModal = ({
  isOpen,
  onClose,
  onSave,
  project,
}: ProjectFormModalProps) => {
  // Updated state to match the TProject interface
  const [formData, setFormData] = useState({
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

  console.log("project", formData);
  useEffect(() => {
    if (isOpen) {
      if (project) {
        // Populate form when editing an existing project
        setFormData({
          title: project.title,
          description: project.description,
          technologies: project.technologies.join(", "),
          category: project.category,
          image: project.image,
          gallery: project.gallery?.join("\n") || "", // Convert gallery array to a newline-separated string
          status: project.status || "In Development",
          liveUrl: project.liveUrl || "",
          githubClient: project.githubClient || "",
          githubServer: project.githubServer || "",
        });
      } else {
        // Reset form when creating a new project
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
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData: TProject = {
      id: project?.id || "",
      createdAt: project?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(), // Always set updatedAt on save
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: formData.status as TProject["status"],
      image: formData.image,
      liveUrl: formData.liveUrl,
      githubClient: formData.githubClient,
      githubServer: formData.githubServer,
      technologies: formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      gallery: formData.gallery
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
    };
    onSave(projectData);
  };

  const isFormValid =
    formData.title &&
    formData.technologies &&
    formData.image &&
    formData.category;

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
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-text-secondary">
              Main Project Image
            </label>

            <ImageUploader
              onUploadSuccess={handleImageUpload}
              initialImageUrl={formData.image}
            />
          </div>
          <Input
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <Textarea
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-text-secondary">
                Category
              </label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
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
              >
                <option>In Development</option>
                <option>Completed</option>
                <option>Live</option>
                <option>On Hold</option>
              </Select>
            </div>
          </div>

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
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-text-secondary">
              Image Gallery (one URL per line)
            </label>
            <Textarea
              name="gallery"
              placeholder="https://.../image1.png&#10;https://.../image2.png"
              value={formData.gallery}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
            <Input
              name="githubClient"
              placeholder="GitHub Client URL (https://...)"
              value={formData.githubClient}
              onChange={handleInputChange}
            />
            <Input
              name="githubServer"
              placeholder="GitHub Server URL (https://...)"
              value={formData.githubServer}
              onChange={handleInputChange}
            />
            <div className="md:col-span-2">
              <Input
                name="liveUrl"
                placeholder="Live URL (https://...)"
                value={formData.liveUrl}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-secondary text-text-main hover:bg-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="px-4 py-2 font-semibold text-white rounded-lg bg-accent hover:bg-accent-hover disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
