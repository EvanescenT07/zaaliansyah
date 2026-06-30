import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar />
      {/* Main Content Area - shifts right on desktop to make room for the fixed sidebar */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 min-h-screen">
        <div className="w-full min-h-[calc(100vh-4rem)] bg-foreground/5 border border-background/10 backdrop-blur-xl rounded-3xl p-6 lg:p-10 shadow-2xl relative overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}