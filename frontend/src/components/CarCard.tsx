"use client";

import Image from "next/image";
import Link from "next/link";
import { Car } from "@/data/cars";
import { Calendar, Gauge, Fuel, MessageCircle } from "lucide-react";

interface CarCardProps {
    car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
    return (
        <div className="glass-card group hover-scale">
            <Link href={`/cars/${car.id}`} className="block relative h-64 overflow-hidden image-overlay">
                <Image
                    src={car.images[0]}
                    alt={`${car.name} ${car.model}`}
                    fill
                    unoptimized={true}
                    className="object-cover transition-transform duration-500 group-hover:scale-110 sharpen-image"
                />
                <div className="absolute top-4 right-4 bg-accent text-primary font-bold px-3 py-1 rounded text-sm">
                    {car.price}
                </div>
            </Link>

            <div className="p-6">
                <div className="mb-4">
                    <Link href={`/cars/${car.id}`}>
                        <h3 className="text-xl font-bold text-secondary group-hover:text-accent transition-colors">
                            {car.name}
                        </h3>
                    </Link>
                    <p className="text-muted text-sm">{car.model}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="flex flex-col items-center p-2 bg-primary rounded">
                        <Calendar size={16} className="text-accent mb-1" />
                        <span className="text-[10px] text-muted uppercase">Year</span>
                        <span className="text-xs font-bold">{car.year}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-primary rounded">
                        <Gauge size={16} className="text-accent mb-1" />
                        <span className="text-[10px] text-muted uppercase">Drive</span>
                        <span className="text-xs font-bold">{car.transmission.substring(0, 3)}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-primary rounded">
                        <Fuel size={16} className="text-accent mb-1" />
                        <span className="text-[10px] text-muted uppercase">Fuel</span>
                        <span className="text-xs font-bold">{car.fuelType}</span>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <Link
                        href={`/cars/${car.id}`}
                        className="flex-1 btn-outline py-2 text-sm"
                    >
                        Details
                    </Link>
                    <a
                        href={`https://wa.me/250780000000?text=Hi, I am interested in the ${car.name} ${car.model} (${car.year}) priced at ${car.price}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-[#25D366] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                    >
                        <MessageCircle size={20} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CarCard;
