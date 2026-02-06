"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CarCard from "@/components/CarCard";
import HeroSlideshow from "@/components/HeroSlideshow";
import { CheckCircle, ShieldCheck, Zap, ArrowRight, Loader2 } from "lucide-react";
import API_BASE_URL from "@/config/api";

interface Car {
  _id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: string;
  transmission: string;
  fuelType: string;
  images: string[];
}

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, settingsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/cars?featured=true`),
          fetch(`${API_BASE_URL}/api/settings`)
        ]);

        const carsData = await carsRes.json();
        const settingsData = await settingsRes.json();

        setFeaturedCars(carsData);
        if (settingsData.heroImage) {
          setHeroImage(settingsData.heroImage);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-primary">
        {!loading && (
          <Image
            src={heroImage || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920"}
            alt="LIZHENG AUTOMOBILE Hero"
            fill
            priority
            unoptimized={true}
            quality={100}
            className="object-cover scale-105 animate-subtle-zoom sharpen-image opacity-40 blur-sm"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-extrabold text-secondary mb-4 tracking-tighter">
                LIZHENG <br />
                <span className="text-accent">AUTOMOBILE</span> Ltd
              </h1>
              <p className="text-xl md:text-2xl text-secondary/80 mb-8 max-w-lg leading-relaxed">
                Quality Cars. Trusted Deals. Discover Rwanda's most exclusive collection of premium vehicles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/cars" className="btn-primary group">
                  View Available Cars
                  <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="https://wa.me/250780000000" className="btn-outline">
                  Chat on WhatsApp
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <HeroSlideshow />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-accent font-bold uppercase tracking-widest text-sm mb-3">Service Excellence</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-secondary">Why Choose LIZHENG?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 hover:border-accent/40 transition-colors">
              <ShieldCheck size={48} className="text-accent mb-6" />
              <h4 className="text-xl font-bold mb-4">Trusted Deals</h4>
              <p className="text-muted leading-relaxed">
                We prioritize transparency and trust in every transaction. Every car in our inventory undergoes rigorous inspection.
              </p>
            </div>
            <div className="glass-card p-8 hover:border-accent/40 transition-colors">
              <CheckCircle size={48} className="text-accent mb-6" />
              <h4 className="text-xl font-bold mb-4">Premium Quality</h4>
              <p className="text-muted leading-relaxed">
                We only source the best vehicles, ensuring that our customers receive cars that are reliable, clean, and well-maintained.
              </p>
            </div>
            <div className="glass-card p-8 hover:border-accent/40 transition-colors">
              <Zap size={48} className="text-accent mb-6" />
              <h4 className="text-xl font-bold mb-4">Affordable luxury</h4>
              <p className="text-muted leading-relaxed">
                Experience premium driving without the premium price tag. We offer competitive pricing for Rwanda's luxury car market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Preview */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-accent font-bold uppercase tracking-widest text-sm mb-3">Our Collection</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold text-secondary">Featured Vehicles</h3>
            </div>
            <Link href="/cars" className="mt-4 md:mt-0 text-accent font-bold flex items-center hover:underline">
              Explore All <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-accent" />
                <p>Loading featured cars...</p>
              </div>
            ) : featuredCars.length > 0 ? (
              featuredCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <h4 className="text-xl font-bold text-secondary mb-2">No available car here</h4>
                <p className="text-muted">Check back later for new arrivals.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-t from-primary to-surface/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full -ml-32 -mb-32" />

            <h3 className="text-3xl md:text-5xl font-extrabold mb-6">Drive Your Dream Car Today</h3>
            <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">
              Visit our showroom in Kigali or contact us directly on WhatsApp to discuss your next vehicle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://wa.me/250780000000" className="btn-primary">
                Message on WhatsApp
              </Link>
              <Link href="/contact" className="btn-outline">
                Find Our Showroom
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
