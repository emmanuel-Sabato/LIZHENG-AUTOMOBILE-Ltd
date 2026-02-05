"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles } from "lucide-react";

// Import images
import img1 from "@/assets/1.jpg";
import img2 from "@/assets/2.jpg";
import img3 from "@/assets/3.jpg";
import img4 from "@/assets/4.jpg";
import img5 from "@/assets/5.jpg";

interface SlideData {
    image: StaticImageData;
    title: string;
    subtitle: string;
    tag: string;
}

const slides: SlideData[] = [
    { image: img1, title: "Premium Selection", subtitle: "Handpicked luxury vehicles", tag: "NEW ARRIVAL" },
    { image: img2, title: "Certified Quality", subtitle: "Rigorous inspection standards", tag: "FEATURED" },
    { image: img3, title: "Best Prices", subtitle: "Competitive market rates", tag: "HOT DEAL" },
    { image: img4, title: "Wide Variety", subtitle: "SUVs, Sedans & More", tag: "POPULAR" },
    { image: img5, title: "Trusted Service", subtitle: "Customer satisfaction first", tag: "EXCLUSIVE" },
];

const SLIDE_DURATION = 6000; // 6 seconds per slide

const HeroSlideshow = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const goToSlide = useCallback((index: number, dir: 'next' | 'prev' = 'next') => {
        setDirection(dir);
        setCurrentIndex(index);
        setProgress(0);
    }, []);

    const nextSlide = useCallback(() => {
        goToSlide((currentIndex + 1) % slides.length, 'next');
    }, [currentIndex, goToSlide]);

    const prevSlide = useCallback(() => {
        goToSlide((currentIndex - 1 + slides.length) % slides.length, 'prev');
    }, [currentIndex, goToSlide]);

    // Auto-advance and progress bar
    useEffect(() => {
        if (isPlaying && !isHovered) {
            progressIntervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        nextSlide();
                        return 0;
                    }
                    return prev + (100 / (SLIDE_DURATION / 50));
                });
            }, 50);
        }

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [isPlaying, isHovered, nextSlide]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === ' ') {
                e.preventDefault();
                setIsPlaying(p => !p);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    // Touch handlers for swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        setTouchStart(null);
    };

    return (
        <div
            ref={containerRef}
            className="group relative w-full aspect-[4/3] lg:aspect-square overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Outer Frame with Glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-accent/10 p-[2px]">
                <div className="relative w-full h-full rounded-[calc(2rem-2px)] overflow-hidden bg-surface/80 backdrop-blur-xl">

                    {/* Slides Container */}
                    {slides.map((slide, index) => {
                        const isActive = index === currentIndex;
                        const isPrev = index === (currentIndex - 1 + slides.length) % slides.length;
                        const isNext = index === (currentIndex + 1) % slides.length;

                        return (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-all duration-1000 ease-out ${isActive
                                    ? "opacity-100 scale-100 z-10"
                                    : isPrev || isNext
                                        ? "opacity-0 scale-105 z-5"
                                        : "opacity-0 scale-110 z-0"
                                    }`}
                                style={{
                                    transform: isActive
                                        ? 'translateX(0)'
                                        : direction === 'next'
                                            ? isPrev ? 'translateX(-10%)' : 'translateX(10%)'
                                            : isPrev ? 'translateX(10%)' : 'translateX(-10%)'
                                }}
                            >
                                {/* Image with Ken Burns Effect */}
                                <div className="absolute inset-4 rounded-[1.5rem] overflow-hidden">
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        className={`object-cover transition-transform ease-out ${isActive
                                            ? "duration-[6000ms] scale-100"
                                            : "duration-500 scale-110"
                                            }`}
                                        style={{
                                            animation: isActive ? 'kenBurns 6s ease-out forwards' : 'none'
                                        }}
                                        quality={100}
                                        priority={index === 0}
                                    />

                                    {/* Cinematic Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-transparent" />

                                    {/* Subtle Vignette */}
                                    <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
                                </div>

                                {/* Slide Content - Positioned above control bar */}
                                <div className={`absolute bottom-20 left-6 right-6 z-20 transition-all duration-700 delay-200 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                    }`}>
                                    {/* Tag Badge */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 backdrop-blur-md border border-accent/30 mb-2">
                                        <Sparkles size={12} className="text-accent animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                                            {slide.tag}
                                        </span>
                                    </div>

                                    {/* Title & Subtitle */}
                                    <h3 className="text-xl lg:text-2xl font-bold text-secondary mb-0.5 drop-shadow-lg line-clamp-1">
                                        {slide.title}
                                    </h3>
                                    <p className="text-xs text-secondary/70 font-medium line-clamp-1">
                                        {slide.subtitle}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {/* Navigation Arrows */}
                    <button
                        onClick={(e) => { e.preventDefault(); prevSlide(); }}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full 
                            bg-white/10 backdrop-blur-md border border-white/20 
                            flex items-center justify-center
                            transition-all duration-300 hover:bg-accent hover:border-accent hover:scale-110
                            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
                        `}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={20} className="text-secondary" />
                    </button>

                    <button
                        onClick={(e) => { e.preventDefault(); nextSlide(); }}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full 
                            bg-white/10 backdrop-blur-md border border-white/20 
                            flex items-center justify-center
                            transition-all duration-300 hover:bg-accent hover:border-accent hover:scale-110
                            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
                        `}
                        aria-label="Next slide"
                    >
                        <ChevronRight size={20} className="text-secondary" />
                    </button>

                    {/* Bottom Controls Bar */}
                    <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
                        <div className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10">

                            {/* Play/Pause Button */}
                            <button
                                onClick={(e) => { e.preventDefault(); setIsPlaying(!isPlaying); }}
                                className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/40 transition-all"
                                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                            >
                                {isPlaying ? (
                                    <Pause size={14} className="text-accent" />
                                ) : (
                                    <Play size={14} className="text-accent ml-0.5" />
                                )}
                            </button>

                            {/* Slide Indicators with Progress */}
                            <div className="flex-1 flex items-center gap-2">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => { e.preventDefault(); goToSlide(index, index > currentIndex ? 'next' : 'prev'); }}
                                        className="relative flex-1 h-1.5 rounded-full overflow-hidden bg-white/20 hover:bg-white/30 transition-colors"
                                        aria-label={`Go to slide ${index + 1}`}
                                    >
                                        {/* Active Progress Fill */}
                                        <div
                                            className={`absolute inset-y-0 left-0 bg-accent rounded-full transition-all ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                                                }`}
                                            style={{
                                                width: index === currentIndex ? `${progress}%` : '0%',
                                                transition: 'width 50ms linear'
                                            }}
                                        />
                                        {/* Completed indicator */}
                                        {index < currentIndex && (
                                            <div className="absolute inset-0 bg-accent/60 rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Slide Counter */}
                            <div className="flex items-center gap-1 text-xs font-mono">
                                <span className="text-accent font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
                                <span className="text-white/40">/</span>
                                <span className="text-white/60">{String(slides.length).padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Corner Decorations */}
                    <div className="absolute top-4 right-4 z-20 pointer-events-none">
                        <div className="w-20 h-20 border-t-2 border-r-2 border-accent/30 rounded-tr-2xl" />
                    </div>
                    <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
                        <div className="w-20 h-20 border-b-2 border-l-2 border-accent/30 rounded-bl-2xl" />
                    </div>

                    {/* Ambient Glow Effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-accent/15 blur-[60px] rounded-full pointer-events-none" />

                    {/* CTA - Clickable area (behind controls) */}
                    <Link
                        href="/cars"
                        className="absolute inset-0 z-5 cursor-pointer"
                        aria-label="View all cars"
                    />
                </div>
            </div>
        </div>
    );
};

export default HeroSlideshow;
