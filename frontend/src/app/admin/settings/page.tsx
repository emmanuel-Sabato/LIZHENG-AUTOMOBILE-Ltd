"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
    Save,
    Globe,
    Phone,
    Mail,
    MapPin,
    Clock,
    Facebook,
    Instagram,
    Linkedin,
    MessageSquare,
    Bell,
    Shield,
    Palette,
    Lock,
    Loader2,
    Eye,
    EyeOff
} from "lucide-react";
import API_BASE_URL from "@/config/api";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState<any>({
        dealershipName: "",
        tagline: "",
        description: "",
        currency: "USD",
        hoursWeekdays: "",
        hoursSaturday: "",
        whatsappNumber: "",
        phoneNumber: "",
        emailAddress: "",
        address: "",
        facebookUrl: "",
        instagramUrl: "",
        linkedinUrl: "",
        twitterUrl: ""
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/settings`);
                const data = await res.json();
                setSettings(data);
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSettings((prev: any) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveGeneral = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE_URL}/api/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE_URL}/api/admin/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });
            const data = await res.json();
            if (res.ok) {
                setSaved(true);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setTimeout(() => setSaved(false), 3000);
            } else {
                alert(data.message || "Failed to update password");
            }
        } catch (error) {
            console.error("Error updating password:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: "general", label: "General", icon: <Globe size={18} /> },
        { id: "contact", label: "Contact", icon: <Phone size={18} /> },
        { id: "social", label: "Social Media", icon: <Facebook size={18} /> },
        { id: "security", label: "Security", icon: <Lock size={18} /> },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            <AdminHeader
                title="Settings"
                subtitle="Configure your dealership & account"
            />

            <main className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-2 space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === tab.id
                                        ? "bg-accent/10 text-accent"
                                        : "text-muted hover:text-secondary hover:bg-white/5"
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="font-medium text-sm">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <div className="glass-card p-6">
                            {/* General Settings */}
                            {activeTab === "general" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-secondary mb-1">General Settings</h3>
                                        <p className="text-sm text-muted">Basic information about your dealership</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2">Dealership Name</label>
                                            <input
                                                type="text"
                                                name="dealershipName"
                                                value={settings.dealershipName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2">Tagline</label>
                                            <input
                                                type="text"
                                                name="tagline"
                                                value={settings.tagline}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-2">Description</label>
                                        <textarea
                                            rows={4}
                                            name="description"
                                            value={settings.description}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2">Weekday Hours</label>
                                            <input
                                                type="text"
                                                name="hoursWeekdays"
                                                value={settings.hoursWeekdays}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2">Saturday Hours</label>
                                            <input
                                                type="text"
                                                name="hoursSaturday"
                                                value={settings.hoursSaturday}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Contact Settings */}
                            {activeTab === "contact" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-secondary mb-1">Contact Information</h3>
                                        <p className="text-sm text-muted">How customers can reach you</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2">WhatsApp</label>
                                            <input
                                                type="text"
                                                name="whatsappNumber"
                                                value={settings.whatsappNumber}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2">Phone</label>
                                            <input
                                                type="text"
                                                name="phoneNumber"
                                                value={settings.phoneNumber}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="emailAddress"
                                            value={settings.emailAddress}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-2">Address</label>
                                        <textarea
                                            rows={2}
                                            name="address"
                                            value={settings.address}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Social Media Settings */}
                            {activeTab === "social" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-secondary mb-1">Social Media Links</h3>
                                        <p className="text-sm text-muted">Connect your social profiles</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2">Facebook URL</label>
                                            <input
                                                type="url"
                                                name="facebookUrl"
                                                value={settings.facebookUrl}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2">Instagram URL</label>
                                            <input
                                                type="url"
                                                name="instagramUrl"
                                                value={settings.instagramUrl}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2">LinkedIn URL</label>
                                            <input
                                                type="url"
                                                name="linkedinUrl"
                                                value={settings.linkedinUrl}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2">X (Twitter) URL</label>
                                            <input
                                                type="url"
                                                name="twitterUrl"
                                                value={settings.twitterUrl}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security tab */}
                            {activeTab === "security" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-secondary mb-1">Security & Account</h3>
                                        <p className="text-sm text-muted">Manage your admin password and account safety</p>
                                    </div>

                                    <div className="max-w-md space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2">Current Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="currentPassword"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50"
                                                />
                                                <button
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5">
                                            <label className="block text-sm font-medium text-secondary mb-2">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 mb-4"
                                            />
                                            <label className="block text-sm font-medium text-secondary mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50"
                                            />
                                        </div>

                                        <button
                                            onClick={handleUpdatePassword}
                                            disabled={isSaving}
                                            className="w-full btn-primary flex items-center justify-center gap-2 mt-4"
                                        >
                                            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Shield size={18} />}
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Save Button for Settings */}
                            {activeTab !== "security" && (
                                <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5">
                                    <div>
                                        {saved && (
                                            <span className="text-green-500 text-sm flex items-center gap-2 animate-fade-in">
                                                <Shield size={16} />
                                                Settings saved successfully!
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleSaveGeneral}
                                        disabled={isSaving}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        Save Changes
                                    </button>
                                </div>
                            )}

                            {activeTab === "security" && saved && (
                                <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <p className="text-green-500 text-sm font-medium flex items-center gap-2">
                                        <Shield size={16} />
                                        Password changed successfully!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
