import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cars } from "@/data/cars";
import {
    Calendar,
    Gauge,
    Fuel,
    MessageCircle,
    ChevronLeft,
    CheckCircle2,
    Info
} from "lucide-react";

export async function generateStaticParams() {
    return cars.map((car) => ({
        id: car.id,
    }));
}

export default async function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const car = cars.find((c) => c.id === id);

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
                                src={car.images[0]}
                                alt={car.name}
                                fill
                                quality={100}
                                className="object-cover sharpen-image"
                                priority
                            />
                        </div>

                        {car.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {car.images.map((img, idx) => (
                                    <div key={idx} className="relative h-24 rounded-lg overflow-hidden glass-card cursor-pointer hover:border-accent transition-all">
                                        <Image
                                            src={img}
                                            alt={`${car.name} thumb ${idx}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
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
                                {car.name}
                            </h1>
                            <p className="text-2xl text-accent font-bold">{car.price}</p>
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
                                {[
                                    "Power Steering",
                                    "Air Conditioning",
                                    "Bluetooth Connectivity",
                                    "Rear Camera",
                                    "Power Windows",
                                    "Alloy Wheels"
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center space-x-2 text-sm text-muted">
                                        <CheckCircle2 size={16} className="text-accent" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-8">
                            <a
                                href={`https://wa.me/250780000000?text=Hi, I am interested in the ${car.name} ${car.model} (${car.year}).`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full btn-primary flex items-center justify-center space-x-3 py-4 text-lg"
                            >
                                <MessageCircle size={24} />
                                <span>Chat Seller on WhatsApp</span>
                            </a>
                            <p className="text-center text-xs text-muted mt-4 italic">
                                Our team usually responds within 15 minutes during working hours.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
