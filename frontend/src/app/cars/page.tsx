import { cars } from "@/data/cars";
import CarCard from "@/components/CarCard";
import { Search, SlidersHorizontal } from "lucide-react";

export const metadata = {
    title: "Available Cars | LIZHENG AUTOMOBILE Ltd",
    description: "Browse our collection of high-quality vehicles in Rwanda.",
};

export default function CarsPage() {
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

                {/* Filter Bar (Visual only) */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, model or year..."
                            className="w-full bg-surface/50 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-secondary focus:outline-none focus:border-accent transition-colors"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 bg-surface/50 border border-white/10 rounded-lg px-6 py-3 text-secondary hover:border-accent transition-colors">
                        <SlidersHorizontal size={20} />
                        Filter
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cars.map((car) => (
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>

                {cars.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-muted text-xl">No cars found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
