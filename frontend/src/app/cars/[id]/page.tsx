import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    Calendar,
    Gauge,
    Fuel,
    MessageCircle,
    ChevronLeft,
    CheckCircle2,
    Info,
    Loader2,
    Star
} from "lucide-react";
import { getOptimizedImageUrl } from "@/utils/cloudinary";
import TalkToUsForm from "@/components/TalkToUsForm";
import CarRating from "@/components/CarRating";

interface Car {
    _id: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    price: string;
    transmission: string;
    fuelType: string;
    mileage: string;
    description: string;
    featured: boolean;
    images: string[];
    features?: string[];
    ratings?: any[];
    averageRating?: number;
}

async function getCar(id: string): Promise<Car | null> {
    try {
        const response = await fetch(`http://localhost:5001/api/cars/${id}`, {
            next: { revalidate: 60 } // Revalidate every minute
        });
        if (!response.ok) return null;
        return response.json();
    } catch (error) {
        console.error("Error fetching car:", error);
        return null;
    }
}

export default async function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const car = await getCar(id);

    if (!car) {
        notFound();
    }

    return (
        <div className="pt-32 pb-24 min-h-screen bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/cars"
                    className="inline-flex items-center text-accent hover:text-white transition-colors mb-8 group"
                >
                    <ChevronLeft size={20} className="mr-1 transition-transform group-hover:-translate-x-1" />
                    Back to Listings
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-6">
                        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden glass-card image-overlay">
                            <Image
                                src={getOptimizedImageUrl(car.images[0] || "", { width: 1200, height: 800 })}
                                alt={`${car.brand} ${car.name}`}
                                fill
                                quality={90}
                                className="object-cover sharpen-image"
                                priority
                            />
                        </div>

                        {car.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {car.images.map((img, idx) => (
                                    <div key={idx} className="relative h-24 rounded-lg overflow-hidden glass-card cursor-pointer hover:border-accent transition-all">
                                        <Image
                                            src={getOptimizedImageUrl(img, { width: 300, height: 200 })}
                                            alt={`${car.brand} ${car.name} thumb ${idx}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Rating Section - Moved inside gallery column */}
                        <div className="mt-8">
                            <CarRating
                                carId={car._id}
                                carName={`${car.brand} ${car.name}`}
                                averageRating={car.averageRating}
                                ratingsCount={car.ratings?.length || 0}
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Available Now
                                </span>
                                {car.featured && (
                                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Featured
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-secondary mb-2 tracking-tighter">
                                {car.brand} {car.name}
                            </h1>
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-2xl text-accent font-bold">{car.price}</p>
                                {car.averageRating !== undefined && car.averageRating > 0 && (
                                    <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded text-accent text-sm font-bold">
                                        <Star fill="currentColor" size={14} />
                                        {car.averageRating.toFixed(1)}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-surface/50 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                                <Calendar className="text-accent mb-2" size={24} />
                                <span className="text-xs text-muted">Year</span>
                                <span className="text-sm font-bold">{car.year}</span>
                            </div>
                            <div className="bg-surface/50 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                                <Gauge className="text-accent mb-2" size={24} />
                                <span className="text-xs text-muted">Transmission</span>
                                <span className="text-sm font-bold">{car.transmission}</span>
                            </div>
                            <div className="bg-surface/50 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                                <Fuel className="text-accent mb-2" size={24} />
                                <span className="text-xs text-muted">Fuel Type</span>
                                <span className="text-sm font-bold">{car.fuelType}</span>
                            </div>
                            <div className="bg-surface/50 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                                <Info className="text-accent mb-2" size={24} />
                                <span className="text-xs text-muted">Mileage</span>
                                <span className="text-sm font-bold">{car.mileage}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold border-b border-white/10 pb-2">Description</h2>
                            <p className="text-muted leading-relaxed">
                                {car.description}
                            </p>
                        </div>

                        <div className="space-y-4 pt-6">
                            <h2 className="text-xl font-bold border-b border-white/10 pb-2">Key Features</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(car.features && car.features.length > 0 ? car.features : [
                                    "Power Steering",
                                    "Air Conditioning",
                                    "Bluetooth Connectivity",
                                    "Rear Camera",
                                    "Power Windows",
                                    "Alloy Wheels"
                                ]).map((feature) => (
                                    <li key={feature} className="flex items-center space-x-2 text-sm text-muted">
                                        <CheckCircle2 size={16} className="text-accent" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-8 space-y-8">
                            <TalkToUsForm
                                carId={car._id}
                                carName={`${car.brand} ${car.name}`}
                            />
                            <p className="text-center text-xs text-muted italic">
                                Our team usually responds within 15 minutes during working hours.
                            </p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
