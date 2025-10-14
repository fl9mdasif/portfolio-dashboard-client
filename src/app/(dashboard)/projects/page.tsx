"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

import ProjectTable from "@/app/(dashboard)/projects/ProjectTable";
import ProjectFormModal from "@/app/(dashboard)/projects/ProjectFormModal";

// --- DUMMY DATA ---
// In a real application, this would be fetched from your server API.
const dummyProjects = [
  {
    id: "proj_001",
    title: "Personal Portfolio v2",
    description:
      "A complete redesign of my personal portfolio, built with Next.js for server-side rendering and static generation. Features a sleek, modern design with Tailwind CSS and Framer Motion for animations.",
    imageUrl:
      "https://media.geeksforgeeks.org/wp-content/uploads/20240909102345/Web-Design-Projects-1.webp",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://your-portfolio-url.com",
    githubClient: "https://github.com/your-username/portfolio-v2",
    githubServer: "https://github.com/your-username/portfolio-v2",
    createdAt: "2025-09-15T10:00:00Z",
  },
  {
    id: "proj_002",
    title: 'E-commerce Platform "ShopSphere"',
    description:
      "A full-featured e-commerce site with product listings, a shopping cart, user authentication, and a Stripe-integrated checkout process. The backend is powered by Node.js and Express.",
    imageUrl:
      "https://cdn.dribbble.com/userupload/32875394/file/original-d33f51858dc31debef5cb6bca897daa0.png?format=webp&resize=400x300&vertical=center",
    technologies: [
      "React",
      "Redux Toolkit",
      "Node.js",
      "Express",
      "MongoDB",
      "Stripe API",
    ],
    liveUrl: "#",
    githubClient: "https://github.com/your-username/shopsphere-client",
    githubServer: "https://github.com/your-username/shopsphere",
    createdAt: "2025-07-22T14:30:00Z",
  },
  {
    id: "proj_003",
    title: 'Real-time Chat Application "ChitChat"',
    description:
      "A web-based chat application using WebSockets for instant messaging. Users can join rooms, send messages, and see who is currently online. Built with a focus on low latency and scalability.",
    imageUrl:
      "https://repository-images.githubusercontent.com/668679012/d9c018e7-4b26-4261-928d-04a8868973a1",
    technologies: ["React", "Socket.IO", "Node.js", "Redis"],
    liveUrl: "#",
    githubClient: "https://github.com/your-username/chitchat-app",
    githubServer: "https://github.com/your-username/chitchat-app",
    createdAt: "2025-05-01T18:45:00Z",
  },
];

// Define and export the Project type so other components can use it
export type Project = (typeof dummyProjects)[0];

const ProjectsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(dummyProjects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleOpenModalForCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSaveProject = (projectData: Project) => {
    // This function simulates saving data to your server.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const promise = new Promise<void>((resolve, reject) => {
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
          const newProject = {
            ...projectData,
            id: `proj_${Date.now()}`,
            createdAt: new Date().toISOString(),
          };
          setProjects((prevProjects) => [...prevProjects, newProject]);
        }
        resolve();
      }, 1000); // Simulate network delay
    });

    toast.promise(promise, {
      loading: "Saving project...",
      success: "Project saved successfully!",
      error: "Failed to save project.",
    });

    handleCloseModal();
  };

  const handleDeleteProject = (projectId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      // Simulate deleting from the server
      setProjects((prevProjects) =>
        prevProjects.filter((p) => p.id !== projectId)
      );
      toast.success("Project deleted successfully!");
    }
  };

  return (
    <div className="text-white">
      {/* Page Header */}
      <div className="flex text-secondary/80 px-5 py-4 items-center justify-between mb-1">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <button
          onClick={handleOpenModalForCreate}
          className="flex items-center gap-2 px-4 py-2 font-semibold transition-colors rounded-lg bg-accent hover:bg-accent-hover"
        >
          <PlusCircle size={20} />
          Add New Project
        </button>
      </div>

      {/* Projects Table */}
      <div className="p-6 border rounded-lg  border-border">
        <ProjectTable
          projects={projects}
          onEdit={handleOpenModalForEdit}
          onDelete={handleDeleteProject}
        />
      </div>

      {/* Modal for Creating/Editing Projects */}
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
