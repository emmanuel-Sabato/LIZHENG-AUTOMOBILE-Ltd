"use client";

import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import API_BASE_URL from "@/config/api";

interface CarRatingProps {
    carId: string;
    carName: string;
    averageRating?: number;
    ratingsCount?: number;
}

export default function CarRating({ carId, carName, averageRating = 0, ratingsCount = 0 }: CarRatingProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [userName, setUserName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Check if user has rated this car
        const hasRated = localStorage.getItem(`rated_car_${carId}`);
        if (hasRated) {
            setSubmitted(true);
            return;
        }

        // Check visit history
        const visitCount = parseInt(localStorage.getItem(`visited_car_${carId}`) || "0");
        if (visitCount >= 1) {
            setShowPrompt(true);
        }

        // Update visit history
        localStorage.setItem(`visited_car_${carId}`, (visitCount + 1).toString());
    }, [carId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a rating.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/cars/${carId}/rate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rating,
                    comment,
                    userName: userName || "Anonymous"
                }),
            });

            if (response.ok) {
                setSubmitted(true);
                localStorage.setItem(`rated_car_${carId}`, "true");
                setShowPrompt(false);
            } else {
                alert("Failed to submit rating. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted && !showPrompt) {
        return (
            <div className="glass-card p-6 text-center space-y-2">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                        <Star fill="currentColor" size={24} />
                    </div>
                </div>
                <h3 className="text-secondary font-bold">Thank you for your rating!</h3>
                <p className="text-sm text-muted">Your feedback helps others make better choices.</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-8 space-y-6 relative overflow-hidden">
            {showPrompt && !submitted && (
                <div className="absolute top-0 left-0 right-0 bg-accent/20 border-b border-accent/20 px-4 py-2 flex items-center justify-between z-10">
                    <p className="text-xs font-bold text-accent uppercase tracking-wider">
                        Welcome back! Would you like to rate this {carName}?
                    </p>
                    <button onClick={() => setShowPrompt(false)} className="text-accent hover:text-white transition-colors">
                        <X size={14} />
                    </button>
                </div>
            )}

            <div className="pt-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-full text-accent font-bold">
                        <Star fill="currentColor" size={18} />
                        <span className="text-lg">{averageRating > 0 ? averageRating.toFixed(1) : "No"} Rates</span>
                    </div>
                </div>
                <h2 className="text-xl font-bold text-secondary mb-1">
                    {averageRating > 0 ? `${averageRating.toFixed(1)} Rates this Car` : "Be the first to rate this Car"}
                </h2>
                <p className="text-muted text-sm">Now you can also rate it</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="transition-transform hover:scale-110 focus:outline-none"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        >
                            <Star
                                size={32}
                                className={`transition-colors ${(hover || rating) >= star
                                    ? "text-accent fill-accent"
                                    : "text-white/10 fill-transparent"
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Your Name (Optional)"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary placeholder:text-muted outline-none focus:border-accent/50 transition-colors"
                    />
                    <textarea
                        placeholder="Write your thoughts..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-secondary placeholder:text-muted outline-none focus:border-accent/50 transition-colors resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="w-full btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isSubmitting ? (
                        "Submitting..."
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            Submit Review
                            <Star size={18} className="group-hover:rotate-12 transition-transform" />
                        </span>
                    )}
                </button>
            </form>
        </div>
    );
}
