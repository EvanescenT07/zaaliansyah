"use client";

import { useState, useEffect } from "react";
import {
  getAcademics,
  createAcademic,
  deleteAcademic,
  updateAcademic,
} from "@/services/academic";
import type { Academic } from "@/lib/generated/prisma/client";
import { GraduationCap, Trash2, Plus, Edit2, X } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ModalConfirmation } from "@/components/ui/confirmation";
import { CreateAcademicInput } from "@/types/data-types";
import Image from "next/image";

export default function AcademicManager() {
  const [academics, setAcademics] = useState<Academic[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  // NEW: Track which record is currently being edited
  const [editingRecord, setEditingRecord] = useState<Academic | null>(null);

  const fetchRecords = async () => {
    setFetching(true);
    const res = await getAcademics();
    if (res.success && res.academics) setAcademics(res.academics);
    setFetching(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: CreateAcademicInput = {
      institution: formData.get("institution") as string,
      degree: formData.get("degree") as string,
      major: formData.get("major") as string,
      logoUrl: formData.get("logoUrl") as string,
      year: formData.get("year") as string,
      location: formData.get("location") as string,
      orderIndex: Number(formData.get("orderIndex")),
    };

    let res;
    if (editingRecord) {
      res = await updateAcademic(editingRecord.id, data);
    } else {
      res = await createAcademic(data);
    }

    if (res.success) {
      toast.success(editingRecord ? "Record updated!" : "Record added!");
      fetchRecords();
      setEditingRecord(null);
    } else {
      toast.error(res.error || "Failed to save record");
    }
    setLoading(false);
  };

  const handleEdit = (record: Academic) => {
    setEditingRecord(record);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = (id: string) => {
    setRecordToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!recordToDelete) return;
    const res = await deleteAcademic(recordToDelete);
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
        title="Delete Academic Record"
        message="Are you sure you want to permanently delete this academic record? This cannot be undone."
        type="danger"
      />

      <div className="border-b border-foreground/10 pb-4">
        <h1 className="text-3xl font-bold font-comfortaa flex items-center gap-3">
          <GraduationCap className="text-primary" size={32} /> Academic History
        </h1>
        <p className="text-foreground/70 font-work-sans mt-2">
          Manage your educational background and degrees.
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
            {editingRecord ? "Edit Record" : "Add New Record"}
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
            name="institution"
            defaultValue={editingRecord?.institution || ""}
            required
            placeholder="Institution Name (e.g. Stanford University)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="degree"
            defaultValue={editingRecord?.degree || ""}
            required
            placeholder="Degree (e.g. Bachelor of Science)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="major"
            defaultValue={editingRecord?.major || ""}
            required
            placeholder="Major (e.g. Computer Science)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="logoUrl"
            defaultValue={editingRecord?.logoUrl || ""}
            required
            placeholder="Logo URL (from Media Manager)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="year"
            defaultValue={editingRecord?.year || ""}
            required
            placeholder="Year (e.g. 2018 - 2022)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="location"
            defaultValue={editingRecord?.location || ""}
            required
            placeholder="Location (e.g. California, USA)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="orderIndex"
            defaultValue={editingRecord?.orderIndex ?? 0}
            type="number"
            required
            placeholder="Display Order (0 is first)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 px-8 flex items-center justify-center bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading
            ? "Saving..."
            : editingRecord
              ? "Update Record"
              : "Save Record"}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-bold font-comfortaa">Existing Records</h2>
        {fetching ? (
          <p className="animate-pulse text-primary font-semibold">
            Loading records...
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {academics.map((record, idx) => (
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
                      alt={record.institution}
                      width={500}
                      height={500}
                      className="w-32 h-32 object-contain rounded-md p-1 shrink-0"
                    />
                  )}
                  <div className="xl:mt-3">
                    <h3 className="font-bold text-lg font-comfortaa">
                      {record.institution}
                    </h3>
                    <p className="text-sm font-semibold text-primary">
                      {record.degree} in {record.major}
                    </p>
                    <p className="text-xs text-foreground/60 mt-2 font-mono">
                      {record.year} • {record.location}
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
            {academics.length === 0 && (
              <p className="text-foreground/50 text-sm py-8 bg-foreground/5 rounded-2xl text-center col-span-2">
                No academic records found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
