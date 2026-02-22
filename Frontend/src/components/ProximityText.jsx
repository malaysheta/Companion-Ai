import React, { useRef, useEffect } from 'react';

// Optimized Proximity Text Component
// Uses direct DOM manipulation to avoid React render cycles on mousemove.
// Caches element positions (rects) to prevent layout thrashing.
// content is static text split into characters.

const ProximityText = ({ children, className = "" }) => {
    const containerRef = useRef(null);
    const charRefs = useRef([]);
    const rectsRef = useRef([]);

    useEffect(() => {
        const updateRects = () => {
            // Calculate rects for all characters
            // We need to filter out nulls in case of unmounting or sparse refs
            rectsRef.current = charRefs.current.map(span =>
                span ? span.getBoundingClientRect() : null
            );
        };

        // Initial calculation
        // wrapped in setTimeout to ensure layout is settled
        const initialTimer = setTimeout(updateRects, 100);
        // Additional check for animations that might settle later
        const secondaryTimer = setTimeout(updateRects, 1000);

        // Update rects on window resize and scroll
        // passive: true improves scroll performance
        window.addEventListener('resize', updateRects, { passive: true });
        window.addEventListener('scroll', updateRects, { capture: true, passive: true });

        // Also use ResizeObserver to detect container size changes
        const resizeObserver = new ResizeObserver(() => {
            updateRects();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        const handleMouseMove = (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            charRefs.current.forEach((span, i) => {
                const rect = rectsRef.current[i];
                if (!span || !rect) return;

                const charCenterX = rect.left + rect.width / 2;
                const charCenterY = rect.top + rect.height / 2;

                const deltaX = mouseX - charCenterX;
                const deltaY = mouseY - charCenterY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                const maxDistance = 100; // proximity range
                const proximity = Math.max(0, 1 - distance / maxDistance);

                const scale = 1 + proximity * 0.3; // scale up to 30%
                const translateY = -proximity * 10; // move up

                // Direct style update - no State, no React Render!
                span.style.transform = `translateY(${translateY}px) scale(${scale})`;
            });
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            clearTimeout(initialTimer);
            clearTimeout(secondaryTimer);
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateRects);
            window.removeEventListener('scroll', updateRects, { capture: true });
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [children]);

    const renderText = (text) => {
        if (typeof text !== 'string') return text;

        return text.split('').map((char, index) => (
            <span
                key={index}
                ref={el => { charRefs.current[index] = el; }}
                className="inline-block transition-transform duration-200 ease-out will-change-transform" // will-change optimizes GPU layering
                style={{ transform: 'translateY(0) scale(1)' }}
            >
                {char === ' ' ? '\u00A0' : char}
            </span>
        ));
    };

    return (
        <span ref={containerRef} className={className}>
            {renderText(children)}
        </span>
    );
};

export default ProximityText;
