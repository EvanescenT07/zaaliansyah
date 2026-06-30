"use client";

import { useState, useEffect } from "react";
import {
  getStatuses,
  createStatus,
  deleteStatus,
  updateStatus,
} from "@/services/status";
import type { Status } from "@/lib/generated/prisma/client";
import { Activity, Trash2, Plus, X, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ModalConfirmation } from "@/components/ui/confirmation";
import { CreateStatusInput } from "@/types/data-types";

export default function StatusManager() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<Status | null>(null);
  const fetchRecords = async () => {
    setFetching(true);
    const res = await getStatuses();
    if (res.success && res.statuses) setStatuses(res.statuses);
    setFetching(false);
  };
  useEffect(() => {
    fetchRecords();
  }, []);
  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: CreateStatusInput = {
      title: formData.get("title") as string,
      count: parseFloat(formData.get("count") as string),
      orderIndex: Number(formData.get("orderIndex")),
    };
    let res;
    if (editingRecord) {
      res = await updateStatus(editingRecord.id, data);
    } else {
      res = await createStatus(data);
    }
    if (res.success) {
      toast.success(editingRecord ? "Metric updated!" : "Metric added!");
      fetchRecords();
      setEditingRecord(null);
    } else {
      toast.error(res.error || "Failed to save metric");
    }
    setLoading(false);
  };
  const handleEdit = (record: Status) => {
    setEditingRecord(record);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const confirmDelete = (id: string) => {
    setRecordToDelete(id);
    setIsDeleteModalOpen(true);
  };
  const executeDelete = async () => {
    if (!recordToDelete) return;
    const res = await deleteStatus(recordToDelete);
    if (res.success) {
      toast.success("Record deleted");
      fetchRecords();
    } else {
      toast.error("Failed to delete record");
    }
    setRecordToDelete(null);
  };
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ModalConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Delete Status Metric"
        message="Are you sure you want to permanently delete this metric? This cannot be undone."
        type="danger"
      />
      <div className="border-b border-foreground/10 pb-4">
        <h1 className="text-3xl font-bold font-comfortaa flex items-center gap-3">
          <Activity className="text-primary" size={32} /> Status & Metrics
        </h1>
        <p className="text-foreground/70 font-work-sans mt-2">
          Manage your high-level portfolio statistics.
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
            {editingRecord ? "Edit Metric" : "Add New Metric"}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="title"
            defaultValue={editingRecord?.title || ""}
            required
            placeholder="Title (e.g. Years Experience)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="count"
            type="number"
            step="0.1"
            defaultValue={editingRecord?.count ?? ""}
            required
            placeholder="Count Value (e.g. 4.5)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
          <input
            name="orderIndex"
            type="number"
            defaultValue={editingRecord?.orderIndex ?? 0}
            required
            placeholder="Display Order (0 is first)"
            className="bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-12 px-8 flex items-center justify-center bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer w-full md:w-auto"
        >
          {loading
            ? "Saving..."
            : editingRecord
              ? "Update Metric"
              : "Save Metric"}
        </button>
      </form>
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-comfortaa">Existing Metrics</h2>
        {fetching ? (
          <p className="animate-pulse text-primary font-semibold">
            Loading metrics...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {statuses.map((status, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={status.id}
                className={`bg-background/40 border rounded-2xl p-5 flex flex-col items-center justify-center relative group text-center transition-colors ${editingRecord?.id === status.id ? "border-primary ring-1 ring-primary" : "border-foreground/10"}`}
              >
                <div className="mb-2">
                  <span className="text-3xl font-bold font-mono text-primary">
                    {status.count}
                  </span>
                </div>
                <h3 className="font-bold text-sm font-comfortaa text-foreground/80">
                  {status.title}
                </h3>

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(status)}
                    className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => confirmDelete(status.id)}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <span className="mt-2 block text-[10px] text-foreground/30 font-mono">
                  Order: {status.orderIndex}
                </span>
              </motion.div>
            ))}
            {statuses.length === 0 && (
              <p className="text-foreground/50 text-sm py-8 bg-foreground/5 rounded-2xl text-center col-span-full">
                No metrics found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
