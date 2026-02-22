import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const FadeContent = ({
    children,
    blur = false,
    duration = 1000,
    easing = 'power2.out',
    initialOpacity = 0,
    threshold = 0.1,
    delay = 0,
    className = '',
    ...props
}) => {
    const elRef = useRef(null);

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;

        gsap.set(el, {
            opacity: initialOpacity,
            filter: blur ? 'blur(10px)' : 'blur(0px)',
            y: 20
        });

        const tl = gsap.to(el, {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: duration / 1000,
            ease: easing,
            delay: delay / 1000,
            paused: true
        });

        ScrollTrigger.create({
            trigger: el,
            start: "top 80%", // slightly adjusted
            toggleActions: "play reverse play reverse",
            onEnter: () => tl.play(),
            onLeave: () => tl.reverse(),
            onEnterBack: () => tl.play(),
            onLeaveBack: () => tl.reverse()
        });

        return () => {
            tl.kill();
        };
    }, [blur, duration, easing, initialOpacity, threshold, delay]);

    return (
        <div ref={elRef} className={className} {...props}>
            {children}
        </div>
    );
};

export default FadeContent;
