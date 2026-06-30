"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { loginWithPin } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    try {
      const result = await loginWithPin(formData);
      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
      } else if (result?.success) {
        toast.success("Welcome back!");
        router.push("/admin");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Check terminal/console!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-foreground/5 border border-background/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full text-primary">
            <Lock size={40} />
          </div>
        </div>

        <h1 className="text-3xl font-bold font-comfortaa text-foreground mb-2">
          Secure Access
        </h1>
        <p className="text-foreground/70 font-work-sans mb-8">
          Enter your master PIN to access the CMS Dashboard.
        </p>

        <form action={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              name="pin"
              placeholder="Input PIN Key"
              maxLength={6}
              minLength={6}
              pattern="[0-9]{6}"
              inputMode="numeric"
              title="Please enter exactly 6 digits"
              required
              className="w-full text-center text-2xl tracking-widest bg-background/50 border border-foreground/10 rounded-xl px-4 py-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg font-bold cursor-pointer"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Unlock Dashboard"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
