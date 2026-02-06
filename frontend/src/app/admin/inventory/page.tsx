"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import API_BASE_URL from "@/config/api";
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
    Image as ImageIcon,
} from "lucide-react";
import { CAR_BRANDS, CAR_CATEGORIES, FUEL_TYPES, TRANSMISSIONS, STATUSES } from "@/constants/carConstants";

interface Car {
    _id: string;
    name: string;
    brand: string;
    category: string;
    model: string;
    year: number;
    price: string;
    transmission: string;
    fuelType: string;
    mileage: string;
    description: string;
    images: string[];
    featured: boolean;
    features: string[];
    status: string;
    createdAt: string;
}

interface SiteSettings {
    heroImage: string;
    aboutImage: string;
    slideshowImages: string[];
}

export default function InventoryPage() {
    const { token } = useAuth();
    const [cars, setCars] = useState<Car[]>([]);
    const [loadingCars, setLoadingCars] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loadingSettings, setLoadingSettings] = useState(true);

    // Form state for adding/editing car
    const [formData, setFormData] = useState({
        name: "",
        brand: CAR_BRANDS[0],
        category: CAR_CATEGORIES[0],
        model: "",
        year: new Date().getFullYear(),
        price: "",
        transmission: TRANSMISSIONS[0],
        fuelType: FUEL_TYPES[0],
        mileage: "",
        description: "",
        featured: false,
        features: [] as string[],
        status: "Available"
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchSettings();
        fetchCars();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings`);
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoadingSettings(false);
        }
    };

    const fetchCars = async () => {
        setLoadingCars(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/cars`);
            const data = await response.json();
            setCars(data);
        } catch (error) {
            console.error("Error fetching cars:", error);
        } finally {
            setLoadingCars(false);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleEditClick = (car: Car) => {
        setFormData({
            name: car.name,
            brand: car.brand,
            category: car.category,
            model: car.model,
            year: car.year,
            price: car.price,
            transmission: car.transmission,
            fuelType: car.fuelType,
            mileage: car.mileage,
            description: car.description,
            featured: car.featured,
            features: car.features || [],
            status: car.status
        });
        setIsEditing(true);
        setEditingId(car._id);
        setShowAddModal(true);
    };

    const handleSubmitCar = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const uploadData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'features') {
                uploadData.append(key, JSON.stringify(value));
            } else {
                uploadData.append(key, value.toString());
            }
        });

        selectedFiles.forEach(file => {
            uploadData.append("images", file);
        });

        try {
            const url = isEditing
                ? `${API_BASE_URL}/api/cars/${editingId}`
                : `${API_BASE_URL}/api/cars`;

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: uploadData,
            });

            if (response.ok) {
                setShowAddModal(false);
                setIsEditing(false);
                setEditingId(null);
                setFormData({
                    name: "",
                    brand: CAR_BRANDS[0],
                    category: CAR_CATEGORIES[0],
                    model: "",
                    year: new Date().getFullYear(),
                    price: "",
                    transmission: TRANSMISSIONS[0],
                    fuelType: FUEL_TYPES[0],
                    mileage: "",
                    description: "",
                    featured: false,
                    features: [],
                    status: "Available"
                });
                setSelectedFiles([]);
                fetchCars();
            } else {
                const error = await response.json();
                alert(error.message || `Failed to ${isEditing ? 'update' : 'add'} car`);
            }
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} car:`, error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCar = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/cars/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                fetchCars();
            } else {
                alert("Failed to delete car");
            }
        } catch (error) {
            console.error("Error deleting car:", error);
        }
    };

    const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/hero`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error("Error uploading hero image:", error);
        }
    };

    const handleAboutUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/about`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error("Error uploading about image:", error);
        }
    };

    const handleSlideshowUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/slideshow`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error("Error uploading slideshow image:", error);
        }
    };

    const handleDeleteSlideshowImage = async (imageUrl: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/slideshow`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ imageUrl }),
            });
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error("Error deleting slideshow image:", error);
        }
    };

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
            car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.brand.toLowerCase().includes(searchQuery.toLowerCase());

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

            <main className="p-6 space-y-8">
                {/* Site Banners Management */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
                            <ImageIcon size={20} className="text-accent" />
                            Site Banners
                        </h2>
                        <p className="text-sm text-muted">Manage your homepage hero and slideshow</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Hero Image Management */}
                        <div className="lg:col-span-1 glass-card p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-secondary">Hero Image</h3>
                            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-white/5 border border-white/10 group">
                                {settings?.heroImage ? (
                                    <Image
                                        src={settings.heroImage}
                                        alt="Hero"
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
                                        <ImageIcon size={32} className="mb-2 opacity-20" />
                                        <p className="text-xs">No hero image set</p>
                                    </div>
                                )}
                                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <div className="flex flex-col items-center gap-2 text-white">
                                        <Upload size={24} />
                                        <span className="text-xs font-medium">Change Hero</span>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleHeroUpload}
                                    />
                                </label>
                            </div>
                            <p className="text-[10px] text-muted leading-relaxed">
                                This image appears as the main background on your homepage.
                                Recommended size: 1920x1080px.
                            </p>
                        </div>

                        {/* About Image Management */}
                        <div className="lg:col-span-1 glass-card p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-secondary">About Image</h3>
                            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-white/5 border border-white/10 group">
                                {settings?.aboutImage ? (
                                    <Image
                                        src={settings.aboutImage}
                                        alt="About"
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
                                        <ImageIcon size={32} className="mb-2 opacity-20" />
                                        <p className="text-xs">No about image set</p>
                                    </div>
                                )}
                                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <div className="flex flex-col items-center gap-2 text-white">
                                        <Upload size={24} />
                                        <span className="text-xs font-medium">Change About</span>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAboutUpload}
                                    />
                                </label>
                            </div>
                            <p className="text-[10px] text-muted leading-relaxed">
                                This image appears in the "About Us" section of your website.
                                Recommended size: 800x600px.
                            </p>
                        </div>

                        {/* Slideshow Management */}
                        <div className="lg:col-span-2 glass-card p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-secondary">Slideshow Gallery</h3>
                                <label className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-xs font-medium transition-colors cursor-pointer">
                                    <Plus size={14} />
                                    Add Image
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleSlideshowUpload}
                                    />
                                </label>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {settings?.slideshowImages.map((img, index) => (
                                    <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/5 group">
                                        <Image
                                            src={img}
                                            alt={`Slideshow ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => handleDeleteSlideshowImage(img)}
                                                className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!settings?.slideshowImages || settings.slideshowImages.length === 0) && (
                                    <div className="col-span-full py-8 text-center text-muted border-2 border-dashed border-white/5 rounded-xl">
                                        <p className="text-xs">No slideshow images added yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-white/5 w-full" />

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
                        onClick={() => {
                            setIsEditing(false);
                            setEditingId(null);
                            setFormData({
                                name: "",
                                brand: CAR_BRANDS[0],
                                category: CAR_CATEGORIES[0],
                                model: "",
                                year: new Date().getFullYear(),
                                price: "",
                                transmission: TRANSMISSIONS[0],
                                fuelType: FUEL_TYPES[0],
                                mileage: "",
                                description: "",
                                featured: false,
                                features: [],
                                status: "Available"
                            });
                            setSelectedFiles([]);
                            setShowAddModal(true);
                        }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add New Car
                    </button>
                </div>

                {/* Cars Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        {loadingCars ? (
                            <div className="p-20 text-center text-muted">Loading models...</div>
                        ) : cars.length === 0 ? (
                            <div className="p-20 text-center text-muted font-medium">No available car here</div>
                        ) : (
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
                                            key={car._id}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            {/* Vehicle */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-white/5">
                                                        <Image
                                                            src={car.images[0] || ""}
                                                            alt={car.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-secondary">
                                                            {car.brand} {car.name}
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
                                                <div className="flex flex-col gap-1">
                                                    <span className={`text-[10px] uppercase tracking-wider font-bold ${car.status === 'Available' ? 'text-green-500' : 'text-orange-500'}`}>
                                                        {car.status}
                                                    </span>
                                                    {car.featured && (
                                                        <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded w-fit uppercase font-bold">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(car)}
                                                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-accent/20 flex items-center justify-center text-muted hover:text-accent transition-colors"
                                                        title="Edit Vehicle"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCar(car._id)}
                                                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-muted hover:text-red-500 transition-colors"
                                                        title="Delete Vehicle"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination Placeholder */}
                    <div className="flex items-center justify-between p-4 border-t border-white/5">
                        <p className="text-sm text-muted">
                            Showing <span className="font-semibold text-secondary">{filteredCars.length}</span> vehicles
                        </p>
                    </div>
                </div>
            </main>

            {/* Add Car Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowAddModal(false)}
                    />
                    <form
                        onSubmit={handleSubmitCar}
                        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-surface rounded-2xl border border-white/10 shadow-2xl"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-bold text-secondary">
                                {isEditing ? "Edit Vehicle" : "Add New Vehicle"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-secondary transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 overflow-y-auto">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">
                                    Vehicle Images ({selectedFiles.length} selected)
                                </label>
                                <label className="block border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-accent/30 transition-colors cursor-pointer">
                                    <Upload size={40} className="mx-auto text-muted mb-3" />
                                    <p className="text-sm text-muted">
                                        Click to upload images (up to 10)
                                    </p>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        required={!isEditing}
                                    />
                                </label>
                                {selectedFiles.length > 0 && (
                                    <div className="mt-3 flex gap-2 overflow-x-auto py-2">
                                        {Array.from(selectedFiles).map((file, i) => (
                                            <div key={i} className="w-16 h-12 bg-white/5 rounded border border-white/10 flex-shrink-0 text-[10px] flex items-center justify-center text-muted truncate px-1">
                                                {file.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Form Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">Car Brand</label>
                                    <select
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                    >
                                        {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">Car Name (model variant)</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        placeholder="e.g., Land Cruiser"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary placeholder:text-muted outline-none focus:border-accent/50 transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                    >
                                        {CAR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">Model (Trim/Spec)</label>
                                    <input
                                        type="text"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleFormChange}
                                        placeholder="e.g., LC300 VXR"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary placeholder:text-muted outline-none focus:border-accent/50 transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">Year</label>
                                    <input
                                        type="number"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">Price</label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleFormChange}
                                        placeholder="e.g., $120,000"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">Transmission</label>
                                    <select
                                        name="transmission"
                                        value={formData.transmission}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                    >
                                        {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">Fuel Type</label>
                                    <select
                                        name="fuelType"
                                        value={formData.fuelType}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                    >
                                        {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">Mileage</label>
                                    <input
                                        type="text"
                                        name="mileage"
                                        value={formData.mileage}
                                        onChange={handleFormChange}
                                        placeholder="e.g., 5,000 km"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary outline-none focus:border-accent/50 transition-colors"
                                    >
                                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    rows={3}
                                    placeholder="Enter vehicle description..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary placeholder:text-muted outline-none focus:border-accent/50 transition-colors resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleFormChange}
                                    className="w-5 h-5 rounded bg-white/5 border-white/10 text-accent focus:ring-accent"
                                />
                                <label htmlFor="featured" className="text-sm text-secondary font-medium cursor-pointer">
                                    Mark as Featured (Shown on homepage)
                                </label>
                            </div>

                            {/* Features Management */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-secondary">Key Features</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-1 px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium border border-accent/20">
                                            {feature}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newFeatures = [...formData.features];
                                                    newFeatures.splice(idx, 1);
                                                    setFormData(prev => ({ ...prev, features: newFeatures }));
                                                }}
                                                className="hover:text-white transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="newFeature"
                                        placeholder="Add a feature (e.g. Leather Seats)"
                                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-secondary placeholder:text-muted outline-none focus:border-accent/50 transition-colors text-sm"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const input = e.currentTarget;
                                                const val = input.value.trim();
                                                if (val && !formData.features.includes(val)) {
                                                    setFormData(prev => ({ ...prev, features: [...prev.features, val] }));
                                                    input.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById('newFeature') as HTMLInputElement;
                                            const val = input.value.trim();
                                            if (val && !formData.features.includes(val)) {
                                                setFormData(prev => ({ ...prev, features: [...prev.features, val] }));
                                                input.value = '';
                                            }
                                        }}
                                        className="px-4 py-2 bg-accent/10 text-accent hover:bg-accent/20 rounded-xl text-sm font-medium transition-colors border border-accent/20"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="btn-outline"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? (isEditing ? "Updating..." : "Adding...")
                                    : (isEditing ? "Update Vehicle" : "Add Vehicle")}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
