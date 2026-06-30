"use client";

import { LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center"
    >
      <div className="p-6 bg-primary/10 rounded-full text-primary shadow-inner">
        <LayoutDashboard size={64} strokeWidth={1.5} />
      </div>
      
      <h1 className="text-4xl lg:text-5xl font-bold font-comfortaa tracking-tight">
        Welcome to CMS
      </h1>
      
      <p className="text-foreground/70 font-work-sans text-lg max-w-lg leading-relaxed">
        Select a category from the sidebar to start managing your portfolio content, updating your profile, or uploading media directly to the cloud.
      </p>
    </motion.div>
  );
}