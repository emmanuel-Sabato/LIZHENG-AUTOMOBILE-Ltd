"use client";

import { useState, useEffect } from "react";
import CarCard from "@/components/CarCard";
import { Search, SlidersHorizontal, Loader2, X } from "lucide-react";
import { CAR_BRANDS, CAR_CATEGORIES, FUEL_TYPES } from "@/constants/carConstants";

interface Car {
    _id: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    price: string;
    transmission: string;
    fuelType: string;
    category: string;
    images: string[];
}

export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("All Brands");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedFuel, setSelectedFuel] = useState("All Fuel Types");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/cars");
                const data = await response.json();
                setCars(data);
            } catch (error) {
                console.error("Error fetching cars:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    const filteredCars = cars.filter((car) => {
        const matchesSearch =
            car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.brand.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesBrand = selectedBrand === "All Brands" || car.brand === selectedBrand;
        const matchesCategory = selectedCategory === "All Categories" || car.category === selectedCategory;
        const matchesFuel = selectedFuel === "All Fuel Types" || car.fuelType === selectedFuel;

        return matchesSearch && matchesBrand && matchesCategory && matchesFuel;
    });

    return (
        <div className="pt-32 pb-24 min-h-screen bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-secondary mb-4 tracking-tighter">
                        Available <span className="text-accent">Collection</span>
                    </h1>
                    <p className="text-muted text-lg max-w-2xl">
                        Explore our curated selection of premium cars. Quality inspected and ready for the road.
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="bg-surface/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-12">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, model or brand..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-secondary focus:outline-none focus:border-accent/50 transition-colors"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center justify-center gap-2 border rounded-xl px-6 py-3 text-secondary transition-all ${showFilters ? "bg-accent border-accent text-primary font-bold" : "bg-white/5 border-white/10 hover:border-accent/50"
                                }`}
                        >
                            <SlidersHorizontal size={20} />
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5 animate-fade-in-down">
                            <div>
                                <label className="block text-xs font-bold text-accent uppercase tracking-wider mb-2">Brand</label>
                                <select
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-secondary focus:outline-none focus:border-accent/50"
                                >
                                    <option value="All Brands">All Brands</option>
                                    {CAR_BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-accent uppercase tracking-wider mb-2">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-secondary focus:outline-none focus:border-accent/50"
                                >
                                    <option value="All Categories">All Categories</option>
                                    {CAR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-accent uppercase tracking-wider mb-2">Fuel Type</label>
                                <select
                                    value={selectedFuel}
                                    onChange={(e) => setSelectedFuel(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-secondary focus:outline-none focus:border-accent/50"
                                >
                                    <option value="All Fuel Types">All Fuel Types</option>
                                    {FUEL_TYPES.map(fuel => <option key={fuel} value={fuel}>{fuel}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    {(selectedBrand !== "All Brands" || selectedCategory !== "All Categories" || selectedFuel !== "All Fuel Types" || searchQuery) && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedBrand("All Brands");
                                    setSelectedCategory("All Categories");
                                    setSelectedFuel("All Fuel Types");
                                }}
                                className="flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors font-bold uppercase tracking-wider"
                            >
                                <X size={14} /> Clear All Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-12 h-12 animate-spin text-accent mb-4" />
                        <p className="text-muted">Loading our collection...</p>
                    </div>
                ) : filteredCars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCars.map((car) => (
                            <CarCard key={car._id} car={car} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-muted text-xl mb-4">No available car here</p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedBrand("All Brands");
                                setSelectedCategory("All Categories");
                                setSelectedFuel("All Fuel Types");
                            }}
                            className="text-accent hover:underline font-bold"
                        >
                            View all available vehicles
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
