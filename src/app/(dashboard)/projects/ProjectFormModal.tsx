"use client";

import { Project } from "@/app/(dashboard)/projects/page";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
// import { ImageUploader } from "@/components/ui/ImageUploader"; // Assuming you have this component

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Project) => void;
  project: Project | null;
}

// Reusable Input Component
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full p-2 text-black bg-white/90 border rounded-lg border-border focus:outline-none focus:ring-2 focus:ring-accent"
  />
);

// Reusable Textarea Component
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    rows={4}
    className="w-full p-2 text-black bg-white/90 border rounded-lg border-border focus:outline-none focus:ring-2 focus:ring-accent"
  />
);

const ProjectFormModal = ({
  isOpen,
  onClose,
  onSave,
  project,
}: ProjectFormModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    imageUrl: "",
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
          imageUrl: project.imageUrl,
          liveUrl: project.liveUrl,
          githubClient: project.githubClient,
          githubServer: project.githubServer,
        });
      } else {
        // Reset form for creating a new project
        setFormData({
          title: "",
          description: "",
          technologies: "",
          imageUrl: "",
          liveUrl: "",
          githubClient: "",
          githubServer: "",
        });
      }
    }
  }, [project, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleImageUpload = (url: string) => {
  //   setFormData((prev) => ({ ...prev, imageUrl: url }));
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData: Project = {
      id: project?.id || "", // Keep existing ID if editing
      createdAt: project?.createdAt || new Date().toISOString(),
      ...formData,
      technologies: formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean), // Filter out empty strings
    };
    onSave(projectData);
  };

  const isFormValid =
    formData.title && formData.technologies && formData.imageUrl;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-2xl p-6 m-4 overflow-y-auto border rounded-lg shadow-xl bg-primary border-border max-h-[90vh]">
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
            <label className="block mb-1 text-sm text-text-secondary">
              Project Image
            </label>
            {/*
              NOTE: You would replace this with your actual ImageUploader.
              The `onUploadSuccess` prop is how it communicates back to the form.
            */}
            {/* <ImageUploader onUploadSuccess={handleImageUpload} /> */}
            {formData.imageUrl && (
              <p className="mt-2 text-xs text-green-400">
                Image ready: {formData.imageUrl}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm text-text-secondary">
              Title
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-text-secondary">
              Description
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-text-secondary">
              Technologies (comma-separated)
            </label>
            <Input
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              placeholder="Next.js, Tailwind CSS, TypeScript"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm text-text-secondary">
                GitHub CLIENT URL
              </label>
              <Input
                name="githuBClient"
                value={formData.githubClient}
                onChange={handleInputChange}
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-text-secondary">
                GitHub SERVER URL
              </label>
              <Input
                name="githubServer"
                value={formData.githubServer}
                onChange={handleInputChange}
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-text-secondary">
                Live URL
              </label>
              <Input
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-red-500 text-text-main hover:bg-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="px-4 py-2 font-semibold text-white rounded-lg bg-green-600 hover:bg-accent-hover disabled:bg-gray-600 disabled:cursor-not-allowed"
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
