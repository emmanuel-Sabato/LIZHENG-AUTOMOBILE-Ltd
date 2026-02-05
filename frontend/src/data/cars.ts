import camry from "../assets/Camry (US specifications).jpg";
import highlander from "../assets/Highlander (US specifications).jpg";
import hilux from "../assets/Hilux (BEV model, Prototype).jpg";
import lexusIS from "../assets/IS (Prototype) Rear.jpg";
import raven1 from "../assets/Toyota-Rava4(1).jpg";
import raven2 from "../assets/Toyota-Rava4(2).jpg";
import raven3 from "../assets/Toyota-Rava4(3).jpg";
import raven4 from "../assets/Toyota-Rava4(4).jpg";
import raven5 from "../assets/Toyota-Rava4(5).jpg";
import raven6 from "../assets/Toyota-Rava4(6).jpg";
import raven7 from "../assets/Toyota-Rava4(7).jpg";
import raven8 from "../assets/Toyota-Rava4(8).jpg";
import tundra from "../assets/Tundra (US specifications).jpg";

export interface Car {
    id: string;
    name: string;
    model: string;
    year: number;
    price: string;
    transmission: "Automatic" | "Manual";
    fuelType: "Petrol" | "Diesel" | "Hybrid" | "Electric";
    mileage: string;
    description: string;
    images: any[];
    featured?: boolean;
}

export const cars: Car[] = [
    {
        id: "toyota-camry-2024",
        name: "Toyota Camry",
        model: "XSE V6",
        year: 2024,
        price: "$35,000",
        transmission: "Automatic",
        fuelType: "Petrol",
        mileage: "0 km",
        description: "The 2024 Toyota Camry XSE V6 offers a perfect blend of performance and luxury with its powerful V6 engine and premium interior features.",
        images: [camry],
        featured: true,
    },
    {
        id: "toyota-highlander-2024",
        name: "Toyota Highlander",
        model: "Limited AWD",
        year: 2024,
        price: "$48,500",
        transmission: "Automatic",
        fuelType: "Hybrid",
        mileage: "0 km",
        description: "Experience ultimate family travel with the Toyota Highlander Limited. Spacious, fuel-efficient, and packed with advanced safety technology.",
        images: [highlander],
        featured: true,
    },
    {
        id: "toyota-hilux-bev",
        name: "Toyota Hilux BEV",
        model: "Electric Prototype",
        year: 2024,
        price: "$55,000",
        transmission: "Automatic",
        fuelType: "Electric",
        mileage: "0 km",
        description: "The future of toughness is here. The Hilux BEV Prototype combines legendary durability with zero-emission electric performance.",
        images: [hilux],
    },
    {
        id: "lexus-is-2024",
        name: "Lexus IS",
        model: "350 F Sport",
        year: 2024,
        price: "$45,900",
        transmission: "Automatic",
        fuelType: "Petrol",
        mileage: "0 km",
        description: "Unmatched elegance and exhilarating performance. The Lexus IS 350 F Sport is designed to thrill with its aggressive styling and precision handling.",
        images: [lexusIS],
        featured: true,
    },
    {
        id: "toyota-rav4-2024",
        name: "Toyota RAV4",
        model: "Adventure",
        year: 2024,
        price: "$32,000",
        transmission: "Automatic",
        fuelType: "Petrol",
        mileage: "0 km",
        description: "Ready for your next adventure. The Toyota RAV4 Adventure is built for those who love to explore, with rugged styling and capable AWD.",
        images: [raven1, raven2, raven3, raven4, raven5, raven6, raven7, raven8],
    },
    {
        id: "toyota-tundra-2024",
        name: "Toyota Tundra",
        model: "TRD Pro",
        year: 2024,
        price: "$62,000",
        transmission: "Automatic",
        fuelType: "Petrol",
        mileage: "0 km",
        description: "The ultimate full-size pickup. The Tundra TRD Pro is engineered to conquer any terrain with its powerful i-FORCE MAX hybrid powertrain.",
        images: [tundra],
        featured: true,
    },
];
