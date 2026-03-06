import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MorphingText } from "@/components/ui/morphing-text";

const LoaderAnimation = ({ onComplete }) => {

    useEffect(() => {
        // Timeline with new morphTime=0.8 and cooldownTime=0.4 (1.2s per word total)
        // Analyzing -> Morphing ends at 0.8s, Cooldown ends at 1.2s
        // Searching -> Morphing ends at 2.0s, Cooldown ends at 2.4s
        // Solving -> Morphing ends at 3.2s, Cooldown ends at 3.6s
        // Ready -> Sharp between 3.2s and 3.6s. Unmounting at 3.4s so exit animation starts while it's sharp.
        const timer = setTimeout(() => {
            onComplete();
        }, 3700);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black text-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)", transition: { duration: 1.2, ease: "easeInOut" } }}
        >
            {/* You can apply any Tailwind font classes here, e.g., font-serif, font-mono, tracking-widest, etc. */}
            <MorphingText
                texts={["Analyzing", "Searching", "Solving", "Ready"]}
            />
        </motion.div>
    );
};

export default LoaderAnimation;
