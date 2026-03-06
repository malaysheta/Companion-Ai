import { useEffect } from 'react';
import Lenis from 'lenis';

const SmoothScroll = () => {
    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.06, // Physics-based buttery smoothing (lower is smoother but more fluid/inertial)
            wheelMultiplier: 1.2, // Slightly more responsive wheel action
            direction: 'vertical',
            gestureDirection: 'vertical',
            smoothWheel: true, // Use smoothWheel instead of deprecated smooth
            smoothTouch: false,
            touchMultiplier: 2,
        });

        let rafId;

        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        // Force Lenis to recalculate height constraints whenever the loader removes "h-screen overflow-hidden" and the view size pops out
        const resizeObserver = new ResizeObserver(() => {
            lenis.resize();
        });

        resizeObserver.observe(document.body);
        const rootEl = document.getElementById('root');
        if (rootEl) resizeObserver.observe(rootEl);

        return () => {
            cancelAnimationFrame(rafId);
            resizeObserver.disconnect();
            lenis.destroy();
        };
    }, []);

    return null;
};

export default SmoothScroll;
