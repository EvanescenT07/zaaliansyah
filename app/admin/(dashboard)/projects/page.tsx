"use client";

import { useState, useEffect } from "react";
import {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
} from "@/services/project";
import { getTechs } from "@/services/tech";
import type { Project, TechStack } from "@/lib/generated/prisma/client";
import { ProjectWithTechType, CreateProjectInput } from "@/types/data-types";
import {
  FolderGit2,
  Trash2,
  Plus,
  Github,
  ExternalLink,
  Edit2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ModalConfirmation } from "@/components/ui/confirmation";
import Image from "next/image";

export default function ProjectsManager() {
  const [projects, setProjects] = useState<ProjectWithTechType[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const [editingRecord, setEditingRecord] =
    useState<ProjectWithTechType | null>(null);

  const fetchRecords = async () => {
    setFetching(true);
    const [resProjects, resTechs] = await Promise.all([
      getProjects(),
      getTechs(),
    ]);

    if (resProjects.success && resProjects.projects) {
      setProjects(resProjects.projects as ProjectWithTechType[]);
    }
    if (resTechs.success && resTechs.techs) {
      setTechStacks(resTechs.techs);
    }

    setFetching(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: CreateProjectInput = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string,
      imageAlt: formData.get("imageAlt") as string,
      githubUrl: (formData.get("githubUrl") as string) || null,
      liveUrl: (formData.get("liveUrl") as string) || null,
      orderIndex: Number(formData.get("orderIndex")),
      techStackIds: selectedTechs,
    };

    let res;
    if (editingRecord) {
      res = await updateProject(editingRecord.id, data);
    } else {
      res = await createProject(data);
    }

    if (res.success) {
      toast.success(
        editingRecord
          ? "Project updated successfully!"
          : "Project added successfully!",
      );
      fetchRecords();
      setEditingRecord(null);
      setSelectedTechs([]);
    } else {
      toast.error(res.error || "Failed to save project");
    }
    setLoading(false);
  };

  const handleEdit = (record: ProjectWithTechType) => {
    setEditingRecord(record);
    setSelectedTechs(record.techStacks.map((t) => t.id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = (id: string) => {
    setRecordToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!recordToDelete) return;
    const res = await deleteProject(recordToDelete);
    if (res.success) {
      toast.success("Project deleted");
      fetchRecords();
    } else {
      toast.error("Failed to delete project");
    }
    setRecordToDelete(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ModalConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Delete Project"
        message="Are you sure you want to permanently delete this project? This cannot be undone."
        type="danger"
      />

      <div className="border-b border-foreground/10 pb-4">
        <h1 className="text-3xl font-bold font-comfortaa flex items-center gap-3">
          <FolderGit2 className="text-primary" size={32} /> Projects Portfolio
        </h1>
        <p className="text-foreground/70 font-work-sans mt-2">
          Manage your showcased projects and case studies.
        </p>
      </div>

      <form
        key={editingRecord ? editingRecord.id : "new"}
        onSubmit={handleCreateOrUpdate}
        className="bg-background/30 p-6 rounded-2xl border border-foreground/10 shadow-lg space-y-6 transition-all"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-comfortaa flex items-center gap-2">
            {editingRecord ? (
              <Edit2 className="text-primary" />
            ) : (
              <Plus className="text-primary" />
            )}
            {editingRecord ? "Edit Project" : "Add New Project"}
          </h2>
          {editingRecord && (
            <button
              type="button"
              onClick={() => {
                setEditingRecord(null);
                setSelectedTechs([]);
              }}
              className="text-foreground/50 hover:text-foreground text-sm flex items-center gap-1 cursor-pointer"
            >
              <X size={16} /> Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            defaultValue={editingRecord?.title || ""}
            required
            placeholder="Project Title"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm md:col-span-2"
          />

          <input
            name="imageUrl"
            defaultValue={editingRecord?.imageUrl || ""}
            required
            placeholder="Image URL (from Media Manager)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="imageAlt"
            defaultValue={editingRecord?.imageAlt || ""}
            required
            placeholder="Image Alt Text (for SEO/Accessibility)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />

          <input
            name="githubUrl"
            defaultValue={editingRecord?.githubUrl || ""}
            placeholder="GitHub Repository URL (Optional)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="liveUrl"
            defaultValue={editingRecord?.liveUrl || ""}
            placeholder="Live Demo URL (Optional)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />

          <div className="md:col-span-2">
            <textarea
              name="description"
              defaultValue={editingRecord?.description || ""}
              required
              rows={4}
              placeholder="Project Description (Tell the story of what you built)"
              className="w-full bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm font-work-sans resize-y"
            />
          </div>

          <input
            name="orderIndex"
            type="number"
            defaultValue={editingRecord?.orderIndex ?? 0}
            required
            placeholder="Display Order (0 is first)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm md:col-span-2"
          />

          <div className="md:col-span-2 space-y-3 mt-2">
            <label className="text-sm font-semibold text-foreground/80 px-1">
              Connected Tech Stacks
            </label>
            <div className="flex flex-wrap gap-2">
              {techStacks.map((tech) => (
                <button
                  type="button"
                  key={tech.id}
                  onClick={() => {
                    setSelectedTechs((prev) =>
                      prev.includes(tech.id)
                        ? prev.filter((id) => id !== tech.id)
                        : [...prev, tech.id],
                    );
                  }}
                  className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                    selectedTechs.includes(tech.id)
                      ? "bg-primary border-primary text-background shadow-md shadow-primary/20"
                      : "bg-foreground/5 border-foreground/20 text-foreground/70 hover:border-primary/50"
                  }`}
                >
                  {tech.name}
                </button>
              ))}
              {techStacks.length === 0 && (
                <p className="text-xs text-foreground/50 italic px-1">
                  No tech stacks available. Please create them first.
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 px-8 flex items-center justify-center bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer w-full md:w-auto mt-4"
        >
          {loading
            ? "Saving..."
            : editingRecord
              ? "Update Project"
              : "Save Project"}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-bold font-comfortaa">Showcased Projects</h2>
        {fetching ? (
          <p className="animate-pulse text-primary font-semibold">
            Loading projects...
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {projects.map((project, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={project.id}
                className={`bg-background/40 border rounded-2xl p-5 flex flex-col justify-between group transition-colors ${editingRecord?.id === project.id ? "border-primary ring-1 ring-primary" : "border-foreground/10"}`}
              >
                <div>
                  <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 bg-foreground/5 border border-foreground/10 relative">
                    <Image
                      src={project.imageUrl}
                      alt={project.imageAlt}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-bold text-lg font-comfortaa">
                    {project.title}
                  </h3>

                  {project.techStacks && project.techStacks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.techStacks.map((tech) => (
                        <span
                          key={tech.id}
                          className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-md font-bold"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-foreground/80 mt-3 font-work-sans line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold bg-foreground/10 hover:bg-primary hover:text-background text-foreground px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Github size={14} /> Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold bg-foreground/10 hover:bg-primary hover:text-background text-foreground px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <ExternalLink size={14} /> Live
                    </a>
                  )}
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-foreground/10">
                  <span className="text-xs text-foreground/40 font-mono">
                    Order: {project.orderIndex}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => confirmDelete(project.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {projects.length === 0 && (
              <p className="text-foreground/50 text-sm py-8 bg-foreground/5 rounded-2xl text-center col-span-2">
                No projects found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
