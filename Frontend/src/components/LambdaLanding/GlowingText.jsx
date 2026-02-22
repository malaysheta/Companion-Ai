import React, { useEffect, useRef } from 'react';

const GlowingText = () => {
    const textRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (textRef.current && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const xPct = (x / rect.width) * 100;
                const yPct = (y / rect.height) * 100;

                // Apply the mask dynamic position to the glowing text only
                const maskStyle = `radial-gradient(200px at ${xPct}% ${yPct}%, white 0%, transparent 100%)`;
                textRef.current.style.mask = maskStyle;
                textRef.current.style.webkitMask = maskStyle;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div ref={containerRef} className="w-full flex justify-center items-center py-12 pointer-events-auto select-none bg-black relative z-10 w-full overflow-hidden mx-16 md:mx-8">
            <svg width="100%" height="200" viewBox="0 0 1000 200" className="w-full h-auto max-w-6xl overflow-visible">
                <defs>
                    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a17ff7" />
                        <stop offset="50%" stopColor="#6236f4" />
                        <stop offset="100%" stopColor="#a17ff7" />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Base Layer - Faint visible text (always visible) */}
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="2"
                    fill="transparent"
                    style={{
                        fontSize: '125px',
                        fontWeight: '700',
                    }}
                >
                    COMPANIONAI
                </text>

                {/* Glow Layer - Neon text (revealed by spotlight) */}
                <text
                    ref={textRef}
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    stroke="url(#textGradient)"
                    strokeWidth="2"
                    fill="transparent"
                    style={{
                        fontSize: '125px',
                        fontWeight: '700',
                        filter: 'url(#glow)',
                        // Initial mask
                        mask: 'radial-gradient(200px at 50% 50%, white 0%, transparent 100%)',
                        WebkitMask: 'radial-gradient(200px at 50% 50%, white 0%, transparent 100%)',
                        transition: 'opacity 0.3s ease'
                    }}
                >
                    COMPANIONAI
                </text>
            </svg>
        </div>
    );
};

export default GlowingText;
