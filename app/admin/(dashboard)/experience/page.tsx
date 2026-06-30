"use client";

import { useState, useEffect } from "react";
import {
  getExperiences,
  createExperience,
  deleteExperience,
  updateExperience,
} from "@/services/experience";
import type { Experience } from "@/lib/generated/prisma/client";
import { Briefcase, Trash2, Plus, Edit2, X } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ModalConfirmation } from "@/components/ui/confirmation";
import { CreateExperienceInput } from "@/types/data-types";
import Image from "next/image";

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const [editingRecord, setEditingRecord] = useState<Experience | null>(null);

  const fetchRecords = async () => {
    setFetching(true);
    const res = await getExperiences();
    if (res.success && res.experiences) setExperiences(res.experiences);
    setFetching(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: CreateExperienceInput = {
      company: formData.get("company") as string,
      position: formData.get("position") as string,
      division: formData.get("division") as string,
      period: formData.get("period") as string,
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      logoUrl: formData.get("logoUrl") as string,
      companyUrl: formData.get("companyUrl") as string,
      orderIndex: Number(formData.get("orderIndex")),
    };

    let res;
    if (editingRecord) {
      res = await updateExperience(editingRecord.id, data);
    } else {
      res = await createExperience(data);
    }

    if (res.success) {
      toast.success(
        editingRecord ? "Experience updated!" : "Experience added!",
      );
      fetchRecords();
      setEditingRecord(null);
    } else {
      toast.error(res.error || "Failed to save record");
    }
    setLoading(false);
  };

  const handleEdit = (record: Experience) => {
    setEditingRecord(record);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = (id: string) => {
    setRecordToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!recordToDelete) return;
    const res = await deleteExperience(recordToDelete);
    if (res.success) {
      toast.success("Record deleted");
      fetchRecords();
    } else {
      toast.error("Failed to delete");
    }
    setRecordToDelete(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ModalConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Delete Experience Record"
        message="Are you sure you want to permanently delete this experience record? This cannot be undone."
        type="danger"
      />

      <div className="border-b border-foreground/10 pb-4">
        <h1 className="text-3xl font-bold font-comfortaa flex items-center gap-3">
          <Briefcase className="text-primary" size={32} /> Professional
          Experience
        </h1>
        <p className="text-foreground/70 font-work-sans mt-2">
          Manage your work history and roles.
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
            {editingRecord ? "Edit Role" : "Add New Role"}
          </h2>
          {editingRecord && (
            <button
              type="button"
              onClick={() => setEditingRecord(null)}
              className="text-foreground/50 hover:text-foreground text-sm flex items-center gap-1 cursor-pointer"
            >
              <X size={16} /> Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="company"
            defaultValue={editingRecord?.company || ""}
            required
            placeholder="Company Name"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="position"
            defaultValue={editingRecord?.position || ""}
            required
            placeholder="Position (e.g. Frontend Engineer)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="division"
            defaultValue={editingRecord?.division || ""}
            required
            placeholder="Division (e.g. Core Product)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="period"
            defaultValue={editingRecord?.period || ""}
            required
            placeholder="Period (e.g. Jan 2022 - Present)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="location"
            defaultValue={editingRecord?.location || ""}
            required
            placeholder="Location (e.g. Remote, UK)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="status"
            defaultValue={editingRecord?.status || ""}
            required
            placeholder="Status (e.g. Full-time, Contract)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="logoUrl"
            defaultValue={editingRecord?.logoUrl || ""}
            required
            placeholder="Company Logo URL (from Media Manager)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="companyUrl"
            defaultValue={editingRecord?.companyUrl || ""}
            required
            placeholder="Company Website URL"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />

          <div className="md:col-span-2">
            <textarea
              name="description"
              defaultValue={editingRecord?.description || ""}
              required
              rows={3}
              placeholder="Job Description (What did you do?)"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 px-8 flex items-center justify-center bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer w-full md:w-auto"
        >
          {loading ? "Saving..." : editingRecord ? "Update Role" : "Save Role"}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-bold font-comfortaa">
          Existing Experience
        </h2>
        {fetching ? (
          <p className="animate-pulse text-primary font-semibold">
            Loading records...
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {experiences.map((record, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={record.id}
                className={`bg-background/40 border rounded-2xl p-5 flex flex-col justify-between transition-colors ${editingRecord?.id === record.id ? "border-primary ring-1 ring-primary" : "border-foreground/10"}`}
              >
                <div className="flex gap-4 items-start">
                  {record.logoUrl && (
                    <Image
                      src={record.logoUrl}
                      alt={record.company}
                      width={500}
                      height={500}
                      className="w-32 h-32 object-contain rounded-md p-1 shrink-0"
                    />
                  )}
                  <div className="">
                    <h3 className="font-bold text-lg font-comfortaa">
                      {record.position}
                    </h3>
                    <p className="text-sm font-semibold text-primary">
                      {record.company} ({record.status})
                    </p>
                    <p className="text-xs text-foreground/60 mt-1 font-mono">
                      {record.period} • {record.location}
                    </p>
                    <p className="text-sm text-foreground/80 mt-3 font-work-sans line-clamp-2">
                      {record.description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-foreground/10">
                  <span className="text-xs text-foreground/40 font-mono">
                    Order: {record.orderIndex}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => confirmDelete(record.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {experiences.length === 0 && (
              <p className="text-foreground/50 text-sm py-8 bg-foreground/5 rounded-2xl text-center col-span-2">
                No experience records found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
