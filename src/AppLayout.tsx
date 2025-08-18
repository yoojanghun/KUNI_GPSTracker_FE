import { AppSidebar } from "@/components/app-sidebar.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        {/* <SidebarTrigger /> */}
        {children}
      </main>
    </SidebarProvider>
  );
}