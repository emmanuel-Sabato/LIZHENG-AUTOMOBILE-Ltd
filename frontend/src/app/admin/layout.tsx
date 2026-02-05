import AdminSidebar from "@/components/admin/AdminSidebar";
import "@/app/globals.css";

export const metadata = {
    title: "Admin Dashboard | LIZHENG AUTOMOBILE",
    description: "LIZHENG AUTOMOBILE Administration Panel",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-primary">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area - offset by sidebar width */}
            <div className="lg:ml-64 transition-all duration-300">
                {children}
            </div>
        </div>
    );
}
