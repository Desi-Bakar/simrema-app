import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 bg-gray-100 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}