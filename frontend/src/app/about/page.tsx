import Image from "next/image";
import aboutImg from "@/assets/IS (Prototype) Cockpit PROMINENCE.jpg";
import { Target, Eye, Shield } from "lucide-react";

export const metadata = {
    title: "About Us | LIZHENG AUTOMOBILE Ltd",
    description: "Learn more about Rwanda's premier car dealership.",
};

export default function AboutPage() {
    return (
        <div className="pt-32 pb-24 min-h-screen bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-secondary mb-4 tracking-tighter">
                        Our <span className="text-accent">Story</span>
                    </h1>
                    <p className="text-muted text-lg max-w-2xl mx-auto">
                        From humble beginnings to becoming Rwanda's most trusted name in premium automotive solutions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden glass-card image-overlay">
                        <Image
                            src={aboutImg}
                            alt="Our Story"
                            fill
                            quality={100}
                            className="object-cover sharpen-image"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-secondary">A Legacy of Excellence in Rwanda</h2>
                        <p className="text-muted leading-relaxed">
                            LIZHENG AUTOMOBILE Ltd was founded with a single mission: to redefine the car buying experience in Rwanda. We recognized a gap in the market for high-quality, reliable, and transparently priced vehicles.
                        </p>
                        <p className="text-muted leading-relaxed">
                            Today, we stand as a beacon of trust for thousands of car owners. Our expertise in the local market allows us to curate a collection that perfectly suits the terrain, needs, and aspirations of our clients in Rwanda.
                        </p>
                        <div className="grid grid-cols-2 gap-6 pt-6">
                            <div className="bg-surface/50 p-6 rounded-xl border border-white/5">
                                <span className="block text-3xl font-extrabold text-accent mb-2">500+</span>
                                <span className="text-sm text-muted uppercase tracking-wider font-bold">Cars Sold</span>
                            </div>
                            <div className="bg-surface/50 p-6 rounded-xl border border-white/5">
                                <span className="block text-3xl font-extrabold text-accent mb-2">98%</span>
                                <span className="text-sm text-muted uppercase tracking-wider font-bold">Client Satisfaction</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center p-8 glass-card border-accent/10">
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Target className="text-accent" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                        <p className="text-muted text-sm leading-relaxed">
                            To provide the highest quality automotive services with integrity, transparency, and superior customer care.
                        </p>
                    </div>
                    <div className="text-center p-8 glass-card border-accent/10">
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Eye className="text-accent" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Our Vision</h3>
                        <p className="text-muted text-sm leading-relaxed">
                            To be the most preferred and leading automobile dealership in East Africa, known for reliability and excellence.
                        </p>
                    </div>
                    <div className="text-center p-8 glass-card border-accent/10">
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Shield className="text-accent" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Our Standards</h3>
                        <p className="text-muted text-sm leading-relaxed">
                            We never compromise on safety or quality. Every vehicle is inspected to meet international standards.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
