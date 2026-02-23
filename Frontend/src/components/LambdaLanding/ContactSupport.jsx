import React from 'react';
import RippleGrid from './RippleGrid';
import FadeContent from '../FadeContent';
import AnimatedContent from '../AnimatedContent';

const ContactSupport = () => {
    return (
        <section className="relative w-full flex flex-col justify-center items-center px-4 bg-[#000000] py-20 min-h-[400px] overflow-hidden">
            <RippleGrid />
            <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center mt-4">
                <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                    <div className="text-4xl md:text-2xl font-sans font-bold tracking-tight text-white mb-4 drop-shadow-md pb-4">
                        Still have questions?
                    </div>
                </FadeContent>

                <FadeContent blur={true} duration={1000} delay={200} easing="ease-out" initialOpacity={0}>
                    <p className="text-white/60 font-sans text-base md:text-lg mb-10 max-w-lg leading-relaxed pb-4">
                        Can't find the answer you're looking for? Our support team is here to help.
                    </p>
                </FadeContent>

                <AnimatedContent
                    distance={30}
                    direction="vertical"
                    reverse={false}
                    config={{ tension: 80, friction: 20 }}
                    initialOpacity={0}
                    animateOpacity
                    scale={0.95}
                    threshold={0.2}
                    delay={400}
                >
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-3 rounded-[9999px] bg-[#1a1a1a] text-[#ffffff] border-none font-sans font-medium transition-colors hover:bg-[#2a2a2a] cursor-pointer !no-underline pointer-events-auto"
                        style={{ textDecoration: 'none' }}
                    >
                        Contact Support
                    </a>
                </AnimatedContent>
            </div>
        </section>
    );
};

export default ContactSupport;
