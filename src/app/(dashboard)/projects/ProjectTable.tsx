// import { Project } from "@/app/(dashboard)/projects/page";
import { TProject } from "@/types/index";

import { Edit, Trash2, ExternalLink, Github } from "lucide-react";
import Image from "next/image";

interface ProjectTableProps {
  projects: TProject[];
  onEdit: (project: TProject) => void;
  onDelete: (projectId: string) => void;
}

const ProjectTable = ({ projects, onEdit, onDelete }: ProjectTableProps) => {
  // Helper to format the date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-text-secondary">No projects found.</p>
        <p className="text-sm text-text-secondary">
          Click Add New Project to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-text-secondary">
        <thead className="text-xs uppercase bg-secondary text-text-secondary">
          <tr>
            <th scope="col" className="px-6 py-3">
              Project Title
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Created On
            </th>
            <th scope="col" className="px-6 py-3">
              live - Client - Server
            </th>
            {/* <th scope="col" className="px-6 py-3"></th> */}
            <th scope="col" className="px-6 py-3 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className="border-b bg-primary/40 border-border hover:bg-secondary/40 transition-colors"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-white whitespace-nowrap"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={80}
                    height={48}
                    className="w-20 h-12 object-cover rounded-md"
                  />
                  <span>{project.title}</span>
                </div>
              </th>

              <td className="px-6 py-4">
                {project.liveUrl && project.liveUrl !== "#" ? (
                  <span className="px-2 py-1 text-xs font-medium text-white bg-green-700 rounded-full">
                    Live
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900/50 rounded-full">
                    Offline
                  </span>
                )}
              </td>

              <td className="px-6 py-4">{formatDate(project.createdAt)}</td>

              <td className="px-6 py-4">
                <div className="flex  gap-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-accent"
                    title="View Live Site"
                  >
                    <ExternalLink size={18} />
                  </a>
                  <a
                    href={project.githubClient}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-white"
                    title="View GitHub Repo"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href={project.githubServer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-white"
                    title="View GitHub Repo"
                  >
                    <Github size={18} />
                  </a>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => onEdit(project)}
                    className="btn  text-green-800 hover:text-blue-400"
                    title="Edit Project"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(project.id)}
                    className="text-red-500im hover:text-red-400"
                    title="Delete Project"
                  >
                    <Trash2 size={18} />
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

export default ProjectTable;
