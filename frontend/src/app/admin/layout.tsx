"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminLoading from "@/components/admin/AdminLoading";
import "@/app/globals.css";
import { usePathname } from "next/navigation";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuth();
    const isLoginPage = pathname === "/admin/login";

    // Show loading screen while checking auth state for protected routes
    // This prevents the "flash of content" (FOC) issue
    if (isLoading && !isLoginPage) {
        return <AdminLoading />;
    }

    // Final safety guard: if not authenticated and not on login page, 
    // keep showing loading while the redirect (in AuthContext) kicks in
    if (!isAuthenticated && !isLoginPage) {
        return <AdminLoading />;
    }

    return (
        <div className="min-h-screen bg-primary text-secondary">
            {/* Sidebar - only show if not on login page */}
            {!isLoginPage && <AdminSidebar />}

            {/* Main Content Area - offset only if not on login page */}
            <div className={`${!isLoginPage ? "lg:ml-64" : ""} transition-all duration-300`}>
                {children}
            </div>
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <AdminLayoutContent>
                {children}
            </AdminLayoutContent>
        </AuthProvider>
    );
}

