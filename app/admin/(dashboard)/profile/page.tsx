"use client";

import { useState, useEffect } from "react";
import { getProfile, upsertProfile } from "@/services/profile"; // <-- Import the type!
import { Save, User } from "lucide-react";
import toast from "react-hot-toast";
import { UpsertProfileInput } from "@/types/data-types";

export default function ProfileManager() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Strictly enforce the state matches our Prisma schema!
  const [formData, setFormData] = useState<UpsertProfileInput>({
    cvUrl: "",
    photoUrl: "",
    desktopText: "",
    mobileText: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      const res = await getProfile();
      if (res.success && res.profile) {
        setFormData({
          cvUrl: res.profile.cvUrl || "",
          photoUrl: res.profile.photoUrl || "",
          desktopText: res.profile.desktopText || "",
          mobileText: res.profile.mobileText || "",
        });
      }
      setFetching(false);
    };
    loadProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const res = await upsertProfile(formData);

    if (res.success) {
      toast.success("Profile saved successfully!");
    } else {
      toast.error(res.error || "Failed to save profile");
    }
    setLoading(false);
  };

  if (fetching)
    return (
      <div className="animate-pulse text-primary font-bold">
        Loading Profile...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-foreground/10 pb-4">
        <h1 className="text-3xl font-bold font-comfortaa flex items-center gap-3">
          <User className="text-primary" size={32} /> Profile Settings
        </h1>
        <p className="text-foreground/70 font-work-sans mt-2">
          Manage your main portfolio details and resume.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-background/30 p-6 rounded-2xl border border-foreground/10 shadow-lg space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">
              CV / Resume URL
            </label>
            <input
              name="cvUrl"
              value={formData.cvUrl}
              onChange={handleChange}
              required
              placeholder="e.g. https://xxxx.public.blob.vercel-storage.com/docs/cv.pdf"
              className="w-full bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">
              Profile Photo URL
            </label>
            <input
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              required
              placeholder="e.g. /assets/profile.png"
              className="w-full bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">
            Desktop &apos;About Me&apos; Text
          </label>
          <textarea
            name="desktopText"
            value={formData.desktopText}
            onChange={handleChange}
            required
            rows={4}
            className="w-full bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary font-work-sans resize-y"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">
            Mobile &apos;About Me&apos; Text
          </label>
          <textarea
            name="mobileText"
            value={formData.mobileText}
            onChange={handleChange}
            required
            rows={3}
            className="w-full bg-foreground/5 border border-foreground/20 rounded-xl px-4 py-3 outline-none focus:border-primary font-work-sans resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 px-8 flex items-center justify-center gap-2 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md disabled:opacity-50 cursor-pointer w-full md:w-auto"
        >
          <Save size={18} /> {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
