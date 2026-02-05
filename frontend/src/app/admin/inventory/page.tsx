"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { cars, Car } from "@/data/cars";
import Image from "next/image";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    X,
    Upload,
} from "lucide-react";

export default function InventoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);

    const filters = [
        { id: "all", label: "All Cars" },
        { id: "featured", label: "Featured" },
        { id: "petrol", label: "Petrol" },
        { id: "hybrid", label: "Hybrid" },
        { id: "electric", label: "Electric" },
    ];

    const filteredCars = cars.filter((car) => {
        const matchesSearch =
            car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.model.toLowerCase().includes(searchQuery.toLowerCase());

        if (selectedFilter === "all") return matchesSearch;
        if (selectedFilter === "featured") return matchesSearch && car.featured;
        return matchesSearch && car.fuelType.toLowerCase() === selectedFilter;
    });

    return (
        <div className="min-h-screen bg-primary">
            <AdminHeader
                title="Inventory Management"
                subtitle={`${cars.length} vehicles in stock`}
            />

            <main className="p-6 space-y-6">
                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
                        {/* Search */}
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-surface rounded-xl border border-white/5 focus-within:border-accent/30 transition-colors flex-1 sm:max-w-sm">
                            <Search size={18} className="text-muted" />
                            <input
                                type="text"
                                placeholder="Search cars..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent text-sm text-secondary placeholder:text-muted outline-none w-full"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 p-1 bg-surface rounded-xl overflow-x-auto">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedFilter(filter.id)}
                                    className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${selectedFilter === filter.id
                                            ? "bg-accent text-primary"
                                            : "text-muted hover:text-secondary"
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add New Car
                    </button>
                </div>

                {/* Cars Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left p-4 text-xs font-semibold text-muted uppercase tracking-wider">
                                        Vehicle
                                    </th>
                                    <th className="text-left p-4 text-xs font-semibold text-muted uppercase tracking-wider">
                                        Year
                                    </th>
                                    <th className="text-left p-4 text-xs font-semibold text-muted uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="text-left p-4 text-xs font-semibold text-muted uppercase tracking-wider">
                                        Fuel Type
                                    </th>
                                    <th className="text-left p-4 text-xs font-semibold text-muted uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-right p-4 text-xs font-semibold text-muted uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCars.map((car) => (
                                    <tr
                                        key={car.id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        {/* Vehicle */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-20 h-14 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={car.images[0]}
                                                        alt={car.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-secondary">
                                                        {car.name}
                                                    </p>
                                                    <p className="text-sm text-muted">{car.model}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Year */}
                                        <td className="p-4">
                                            <span className="text-secondary">{car.year}</span>
                                        </td>

                                        {/* Price */}
                                        <td className="p-4">
                                            <span className="font-semibold text-accent">{car.price}</span>
                                        </td>

                                        {/* Fuel Type */}
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${car.fuelType === "Electric"
                                                        ? "bg-green-500/10 text-green-500"
                                                        : car.fuelType === "Hybrid"
                                                            ? "bg-blue-500/10 text-blue-500"
                                                            : "bg-orange-500/10 text-orange-500"
                                                    }`}
                                            >
                                                {car.fuelType}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${car.featured
                                                        ? "bg-accent/10 text-accent"
                                                        : "bg-white/10 text-muted"
                                                    }`}
                                            >
                                                {car.featured ? "Featured" : "Available"}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-secondary transition-colors">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-500/20 flex items-center justify-center text-muted hover:text-blue-500 transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-muted hover:text-red-500 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4 border-t border-white/5">
                        <p className="text-sm text-muted">
                            Showing <span className="font-semibold text-secondary">{filteredCars.length}</span> of{" "}
                            <span className="font-semibold text-secondary">{cars.length}</span> vehicles
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-secondary transition-colors disabled:opacity-50">
                                <ChevronLeft size={16} />
                            </button>
                            <div className="flex items-center gap-1">
                                <button className="w-8 h-8 rounded-lg bg-accent text-primary font-semibold text-sm">
                                    1
                                </button>
                            </div>
                            <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-secondary transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Add Car Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowAddModal(false)}
                    />
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface rounded-2xl border border-white/10 shadow-2xl m-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-bold text-secondary">Add New Vehicle</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-secondary transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">
                                    Vehicle Images
                                </label>
                                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-accent/30 transition-colors cursor-pointer">
                                    <Upload size={40} className="mx-auto text-muted mb-3" />
                                    <p className="text-sm text-muted">
                                        Drag and drop images, or{" "}
                                        <span className="text-accent">browse</span>
                                    </p>
                                    <p className="text-xs text-muted/60 mt-1">
                                        PNG, JPG up to 10MB
                                    </p>
                                </div>
                            </div>

                            {/* Form Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        Car Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Toyota Camry"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary placeholder:text-muted outline-none focus:border-accent/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        Model
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., XSE V6"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary placeholder:text-muted outline-none focus:border-accent/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        Year
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="2024"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary placeholder:text-muted outline-none focus:border-accent/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        Price
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="$35,000"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary placeholder:text-muted outline-none focus:border-accent/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        Transmission
                                    </label>
                                    <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors">
                                        <option value="Automatic">Automatic</option>
                                        <option value="Manual">Manual</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        Fuel Type
                                    </label>
                                    <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors">
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="Electric">Electric</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Enter vehicle description..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary placeholder:text-muted outline-none focus:border-accent/50 transition-colors resize-none"
                                />
                            </div>

                            {/* Featured Toggle */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    className="w-5 h-5 rounded bg-white/5 border-white/10 text-accent focus:ring-accent"
                                />
                                <label htmlFor="featured" className="text-sm text-secondary">
                                    Mark as Featured
                                </label>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="btn-outline"
                            >
                                Cancel
                            </button>
                            <button className="btn-primary">Add Vehicle</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
