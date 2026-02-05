"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [saved, setSaved] = useState(false);

    const tabs = [
        { id: "general", label: "General", icon: <Globe size={18} /> },
        { id: "contact", label: "Contact", icon: <Phone size={18} /> },
        { id: "social", label: "Social Media", icon: <Facebook size={18} /> },
        { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    ];

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen bg-primary">
            <AdminHeader
                title="Settings"
                subtitle="Configure your dealership"
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
                                            <label className="block text-sm font-medium text-secondary mb-2">
                                                Dealership Name
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="LIZHENG AUTOMOBILE Ltd"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2">
                                                Tagline
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="Quality Cars. Trusted Deals."
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            rows={4}
                                            defaultValue="Rwanda's premier destination for quality pre-owned vehicles. We offer a handpicked selection of premium cars at competitive prices."
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-2">
                                            Business Hours
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3">
                                                <Clock size={18} className="text-muted" />
                                                <span className="text-sm text-muted">Monday - Friday:</span>
                                                <input
                                                    type="text"
                                                    defaultValue="8:00 AM - 6:00 PM"
                                                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-secondary text-sm outline-none focus:border-accent/50"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Clock size={18} className="text-muted" />
                                                <span className="text-sm text-muted">Saturday:</span>
                                                <input
                                                    type="text"
                                                    defaultValue="9:00 AM - 4:00 PM"
                                                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-secondary text-sm outline-none focus:border-accent/50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-2">
                                            Currency
                                        </label>
                                        <select className="w-full md:w-48 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors">
                                            <option value="USD">USD ($)</option>
                                            <option value="RWF">RWF (Frw)</option>
                                            <option value="EUR">EUR (€)</option>
                                        </select>
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

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2 flex items-center gap-2">
                                                <MessageSquare size={16} className="text-green-500" />
                                                WhatsApp Number
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="+250 780 000 000"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                            />
                                            <p className="text-xs text-muted mt-1">This number will be used for all WhatsApp inquiries</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2 flex items-center gap-2">
                                                <Phone size={16} className="text-blue-500" />
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="+250 788 000 000"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2 flex items-center gap-2">
                                                <Mail size={16} className="text-accent" />
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                defaultValue="info@lizhengauto.rw"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2 flex items-center gap-2">
                                                <MapPin size={16} className="text-red-500" />
                                                Showroom Address
                                            </label>
                                            <textarea
                                                rows={2}
                                                defaultValue="KG 123 Street, Kimihurura, Kigali, Rwanda"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors resize-none"
                                            />
                                        </div>
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
                                            <label className="block text-sm font-medium text-secondary mb-2 flex items-center gap-2">
                                                <Facebook size={16} className="text-blue-600" />
                                                Facebook
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="https://facebook.com/yourpage"
                                                defaultValue="https://facebook.com/lizhengauto"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary placeholder:text-muted outline-none focus:border-accent/50 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2 flex items-center gap-2">
                                                <Instagram size={16} className="text-pink-500" />
                                                Instagram
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="https://instagram.com/yourhandle"
                                                defaultValue="https://instagram.com/lizhengauto"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary placeholder:text-muted outline-none focus:border-accent/50 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-secondary mb-2 flex items-center gap-2">
                                                <Linkedin size={16} className="text-blue-500" />
                                                LinkedIn
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="https://linkedin.com/company/yourcompany"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary placeholder:text-muted outline-none focus:border-accent/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notification Settings */}
                            {activeTab === "notifications" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-secondary mb-1">Notification Preferences</h3>
                                        <p className="text-sm text-muted">Control how you receive alerts</p>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { label: "New inquiry notifications", description: "Get notified when a customer submits an inquiry", enabled: true },
                                            { label: "Daily summary email", description: "Receive a daily summary of activity", enabled: true },
                                            { label: "Weekly analytics report", description: "Weekly performance insights", enabled: false },
                                            { label: "Low inventory alerts", description: "Alert when stock runs low", enabled: true },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                                <div>
                                                    <p className="font-medium text-secondary">{item.label}</p>
                                                    <p className="text-sm text-muted">{item.description}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked={item.enabled}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Save Button */}
                            <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5">
                                <div>
                                    {saved && (
                                        <span className="text-green-500 text-sm flex items-center gap-2">
                                            <Shield size={16} />
                                            Settings saved successfully!
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
