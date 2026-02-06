"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Initialize from localStorage
        const storedUser = localStorage.getItem("adminUser");
        const storedToken = localStorage.getItem("adminToken");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User, userToken: string) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem("adminUser", JSON.stringify(userData));
        localStorage.setItem("adminToken", userToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
    };

    // Route protection: Only protect /admin routes (except /admin/login)
    useEffect(() => {
        if (!isLoading) {
            const isAdminPath = pathname.startsWith("/admin");
            const isLoginPage = pathname === "/admin/login";

            if (isAdminPath && !isLoginPage && !user) {
                router.push("/admin/login");
            }
        }
    }, [user, isLoading, pathname, router]);

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
