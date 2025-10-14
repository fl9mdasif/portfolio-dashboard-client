"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

// CHANGE 1: Import the TProject interface and your components
import { TProject } from "@/types"; // Adjust path if needed
import ProjectFormModal from "./ProjectFormModal";
import ProjectTable from "./ProjectTable";

// CHANGE 2: Update the dummy data to match the TProject interface
const dummyProjects: TProject[] = [
  {
    id: "proj_001",
    title: "Personal Portfolio v2",
    description: "A complete redesign of my personal portfolio...",
    // Renamed imageUrl to image
    image:
      "https://media.geeksforgeeks.org/wp-content/uploads/20240909102345/Web-Design-Projects-1.webp",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://your-portfolio-url.com",
    category: "Frontend",
    gallery: [],
    status: "Completed",
    githubClient: "https://github.com/your-username/portfolio-v2",
    githubServer: "https://github.com/your-username/portfolio-v2",
    createdAt: "2025-09-15T10:00:00Z",
    // Added updatedAt
    updatedAt: "2025-09-15T10:00:00Z",
  },
  {
    id: "proj_002",
    title: 'E-commerce Platform "ShopSphere"',
    description: "A full-featured e-commerce site...",
    // Renamed imageUrl to image
    image:
      "https://cdn.dribbble.com/userupload/32875394/file/original-d33f51858dc31debef5cb6bca897daa0.png?format=webp&resize=400x300&vertical=center",
    technologies: [
      "React",
      "Redux Toolkit",
      "Node.js",
      "Express",
      "MongoDB",
      "Stripe API",
    ],
    category: "Full Stack",
    status: "Completed",
    liveUrl: "#",
    gallery: [],
    githubClient: "https://github.com/your-username/shopsphere-client",
    githubServer: "https://github.com/your-username/shopsphere",
    createdAt: "2025-07-22T14:30:00Z",
    // Added updatedAt
    updatedAt: "2025-07-23T11:00:00Z",
  },
  {
    id: "proj_003",
    title: 'Real-time Chat Application "ChitChat"',
    description: "A web-based chat application using WebSockets...",
    // Renamed imageUrl to image
    image:
      "https://repository-images.githubusercontent.com/668679012/d9c018e7-4b26-4261-928d-04a8868973a1",
    technologies: ["React", "Socket.IO", "Node.js", "Redis"],
    liveUrl: "#",
    category: "Full Stack",
    status: "In Development",
    gallery: [],
    githubClient: "https://github.com/your-username/chitchat-app",
    githubServer: "https://github.com/your-username/chitchat-app",
    createdAt: "2025-05-01T18:45:00Z",
    // Added updatedAt
    updatedAt: "2025-08-10T16:20:00Z",
  },
];

// CHANGE 3: Remove the old, locally inferred 'Project' type. We will use TProject directly.
// export type Project = (typeof dummyProjects)[0]; // DELETE THIS LINE

const ProjectsPage = () => {
  // CHANGE 4: Update the state to use the TProject type
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<TProject[]>(dummyProjects);
  const [editingProject, setEditingProject] = useState<TProject | null>(null);

  const handleOpenModalForCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (project: TProject) => {
    // Use TProject type
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  // CHANGE 5: Update the function signature to accept a TProject
  const handleSaveProject = (projectData: TProject) => {
    const promise = new Promise<void>((resolve) => {
      setTimeout(() => {
        if (editingProject) {
          // UPDATE logic
          setProjects(
            projects.map((p) =>
              p.id === editingProject.id
                ? { ...projectData, id: editingProject.id }
                : p
            )
          );
        } else {
          // CREATE logic
          const newProject: TProject = {
            ...projectData,
            id: `proj_${Date.now()}`,
            createdAt: new Date().toISOString(),
          };
          setProjects((prevProjects) => [...prevProjects, newProject]);
        }
        resolve();
      }, 1000);
    });

    toast.promise(promise, {
      loading: "Saving project...",
      success: "Project saved successfully!",
      error: "Failed to save project.",
    });

    handleCloseModal();
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects((prevProjects) =>
        prevProjects.filter((p) => p.id !== projectId)
      );
      toast.success("Project deleted successfully!");
    }
  };

  return (
    <div className="text-white">
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

      <div className="p-6 border rounded-lg border-border">
        {/* Pass the correct props to ProjectTable */}
        <ProjectTable
          projects={projects}
          onEdit={handleOpenModalForEdit}
          onDelete={handleDeleteProject}
        />
      </div>

      {/* This will now work without errors */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProject}
        project={editingProject}
      />
    </div>
  );
};

export default ProjectsPage;
