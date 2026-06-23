import SideBar from "@/components/admin/layout/SideBar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <SideBar />

      <main className="min-w-0 flex-1 pt-14 md:pt-6 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
