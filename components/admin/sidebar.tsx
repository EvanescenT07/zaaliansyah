"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Code2,
  Activity,
  Share2,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useState } from "react";
import { logoutAction } from "@/auth/auth";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Academic", href: "/admin/academic", icon: GraduationCap },
  { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { name: "Tech Stack", href: "/admin/tech", icon: Code2 },
  { name: "Status", href: "/admin/status", icon: Activity },
  { name: "Social", href: "/admin/social", icon: Share2 },
  { name: "Media Manager", href: "/admin/media", icon: ImageIcon },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    toast.success("Logged out successfully");
    router.push("/admin/login");
    router.refresh();
  };

  const renderSidebarContent = () => (
    <div className="h-full w-full bg-foreground/5 border border-background/10 backdrop-blur-3xl rounded-3xl p-6 flex flex-col shadow-2xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-comfortaa text-foreground tracking-tight">
            CMS Admin
          </h2>
          <p className="text-xs text-foreground/50 font-work-sans mt-1">
            Manage your portfolio
          </p>
        </div>
        {/* Close button for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 bg-foreground/10 hover:bg-foreground/20 rounded-full transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-work-sans text-sm font-medium",
                isActive
                  ? "bg-primary/20 text-primary shadow-sm"
                  : "text-foreground/70 hover:bg-foreground/10 hover:text-foreground hover:translate-x-1",
              )}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 mt-6 border-t border-background/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-work-sans text-sm font-medium cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Button (Floating top right) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-[90] lg:hidden p-3 bg-primary text-background rounded-xl shadow-lg cursor-pointer"
      >
        <Menu size={24} />
      </button>

      {/* Desktop Sidebar (Always visible on lg) */}
      <aside className="w-64 h-screen fixed left-0 top-0 p-4 hidden lg:flex flex-col z-[100]">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar (Slide in with AnimatePresence) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[98] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-72 h-screen fixed left-0 top-0 p-4 z-[99] lg:hidden"
            >
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
