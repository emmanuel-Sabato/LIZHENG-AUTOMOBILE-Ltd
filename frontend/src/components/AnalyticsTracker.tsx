"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import API_BASE_URL from "@/config/api";

const AnalyticsTracker = () => {
    const pathname = usePathname();

    useEffect(() => {
        const recordView = async () => {
            // Only track in production or if needed in dev
            // if (process.env.NODE_ENV !== 'production') return;

            // Simple device type detection
            let deviceType = 'Desktop';
            if (typeof window !== 'undefined') {
                const width = window.innerWidth;
                if (width < 768) deviceType = 'Mobile';
                else if (width < 1024) deviceType = 'Tablet';
            }

            try {
                await fetch(`${API_BASE_URL}/api/analytics`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        page: pathname,
                        deviceType: deviceType,
                        // Country tracking could be added via a 
                        // geolocating API or Vercel Headers if available
                    }),
                });
            } catch (error) {
                console.error("Failed to record analytics:", error);
            }
        };

        recordView();
    }, [pathname]);

    return null; // This component doesn't render anything
};

export default AnalyticsTracker;
