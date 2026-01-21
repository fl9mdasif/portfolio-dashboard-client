/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { TProject } from "@/types"; // Make sure TProject includes '_id?: string;'
import ProjectFormModal from "./ProjectFormModal";
import ProjectTable from "./ProjectTable";

// Import RTK Query hooks
import {
  useGetAllProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation, // Assuming your API slice exports this for bulk/single delete
} from "@/redux/api/projectApi";

const ProjectsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<TProject | null>(null);

  // Fetch projects using RTK Query
  const { data: projectsData, refetch, isLoading } = useGetAllProjectsQuery({});
  const projects = projectsData?.data; // Extract the data array

  // Mutation hooks
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation(); // Use the correct hook name

  const handleOpenModalForCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (project: TProject) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  // Handle saving (Create or Update)
  const handleSaveProject = async (projectFormData: Partial<TProject>) => {
    // Prepare payload by removing server-managed fields
    const payload = { ...projectFormData };
    delete payload._id;
    delete payload._id; // Also remove 'id' if it exists
    delete payload.createdAt;
    delete payload.updatedAt;

    try {
      if (editingProject?._id) {
        // UPDATE Logic: Use the correct arguments (id and data)
        await updateProject({
          id: editingProject._id, // Pass the ID for the URL parameter
          data: payload, // Pass the cleaned data for the request body
        }).unwrap(); // Use unwrap to handle success/error directly
        toast.success("Project updated successfully!");
      } else {
        // CREATE Logic
        await createProject(payload).unwrap(); // Send cleaned data
        toast.success("Project created successfully!");
      }
      handleCloseModal();
    } catch (error: any) {
      console.error("Save Project Error:", error); // Log the full error for debugging
      toast.error(error?.data?.message || "Failed to save project.");
    }
  };

  // Handle deleting a project
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        // Assuming deleteProjects expects an array of IDs
        await deleteProject([projectId]).unwrap();
        toast.success("Project deleted successfully!");
        // No need to refetch manually, RTK Query invalidates tags and refetches automatically
      } catch (error: any) {
        console.error("Delete Project Error:", error); // Log the full error
        toast.error(error?.data?.message || "Failed to delete project.");
      }
    }
  };

  // Show loading state while fetching initial data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        {" "}
        {/* Adjust height as needed */}
        <Loader2 className="w-16 h-16 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex text-secondary/80 px-5 py-4 items-center justify-between mb-1">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <button
          onClick={handleOpenModalForCreate}
          className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors rounded-lg bg-accent hover:bg-accent-hover"
        >
          <PlusCircle size={20} />
          Add New Project
        </button>
      </div>

      {/* Project Table Container */}
      <div className="p-6 border rounded-lg border-border">
        <ProjectTable
          refetch={refetch}
          projects={projects || []}
          onEdit={handleOpenModalForEdit}
          onDelete={handleDeleteProject}
          // refetch is not typically needed here as RTK Query handles it
        />
      </div>

      {/* Form Modal */}
      <ProjectFormModal
        isLoading={isCreating || isUpdating || isDeleting} // Combine loading states
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProject}
        project={editingProject}
        // isLoading={isCreating || isUpdating || isDeleting} // Combine loading states
      />
    </div>
  );
};

export default ProjectsPage;
