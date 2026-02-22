import React, { useState, useEffect } from 'react';

const FontSwap = ({ children, className = "", delay = 0, loopDuration = 6000, pixelDuration = 1000 }) => {
    const [isPixel, setIsPixel] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            const triggerGlitch = () => {
                setIsPixel(true);
                setTimeout(() => {
                    setIsPixel(false);
                }, pixelDuration);
            };

            triggerGlitch();
            const interval = setInterval(triggerGlitch, loopDuration);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [delay, loopDuration, pixelDuration]);

    return (
        <span className={`inline-block relative ${className}`}>
            {/* 
                Phantom element: 
                Reserves the exact space of the normal character.
                We explicitly inherit tracking and font styles to match the parent H1 exactly.
            */}
            <span className="opacity-0 select-none font-sans font-bold text-inherit tracking-inherit">
                {children}
            </span>

            {/* 
                Visible element:
                Absolutely positioned over the phantom element. 
                It does not affect layout width/height, so switching fonts (even if wider) won't shift neighbors.
            */}
            <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-75 select-none ${isPixel
                    ? 'bg-white text-black font-[apkarchivr21] tracking-normal' // Pixel state: White box, black text, reset tracking for pixel font
                    : 'text-inherit font-sans font-bold tracking-inherit'         // Normal state: Inherit everything
                    }`}
                aria-hidden="true"
            >
                {children}
            </span>
        </span>
    );
};

export default FontSwap;
