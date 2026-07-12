import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PageTransitionWrapper } from "@/components/layout/page-transition";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="flex min-h-screen bg-mesh">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col">
          <Header />
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
        </div>
      </div>
    </Providers>
  );
}
