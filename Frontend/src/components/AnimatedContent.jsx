import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const AnimatedContent = ({
    children,
    distance = 100,
    direction = 'vertical',
    reverse = false,
    duration = 0.8,
    initialOpacity = 0,
    animateOpacity = true,
    scale = 1,
    threshold = 0.1,
    delay = 0,
    className = '',
    ...props
}) => {
    const elRef = useRef(null);

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;

        const axis = direction === 'horizontal' ? 'x' : 'y';
        const offset = reverse ? -distance : distance;

        gsap.set(el, {
            opacity: animateOpacity ? initialOpacity : 1,
            [axis]: offset,
            scale: scale
        });

        const animDuration = duration;
        const animDelay = delay / 1000;

        const tl = gsap.to(el, {
            opacity: 1,
            [axis]: 0,
            scale: 1,
            duration: animDuration,
            ease: 'power3.out',
            delay: animDelay,
            paused: true
        });

        ScrollTrigger.create({
            trigger: el,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
            onEnter: () => tl.play(),
            onLeave: () => tl.reverse(),
            onEnterBack: () => tl.play(),
            onLeaveBack: () => tl.reverse()
        });

        return () => {
            tl.kill();
        };
    }, [distance, direction, reverse, duration, initialOpacity, animateOpacity, scale, threshold, delay]);

    return (
        <div ref={elRef} className={className} {...props}>
            {children}
        </div>
    );
};

export default AnimatedContent;
