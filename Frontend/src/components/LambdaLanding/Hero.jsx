import React, { startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelBlast from './PixelBlast';
import FontSwap from './FontSwap';



const Hero = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        startTransition(() => {
            navigate(path);
        });
    };

    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black text-white pt-20">
            {/* Background Animation Container */}
            <div className="absolute inset-0 z-0 pointer-events-auto">
                <PixelBlast
                    variant="square"
                    pixelSize={4}
                    color="#B19EEF"
                    patternScale={3}
                    patternDensity={1}
                    pixelSizeJitter={0}
                    enableRipples
                    rippleSpeed={0.4}
                    rippleThickness={0.12}
                    rippleIntensityScale={1.5}
                    liquid={false}
                    liquidStrength={0.12}
                    liquidRadius={1.2}
                    liquidWobbleSpeed={5}
                    speed={0.5}
                    edgeFade={0.1}
                    transparent
                />
                {/* Radial gradient overlay to darken center for text legibility */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
            </div>

            <div className="z-10 relative flex flex-col items-center max-w-[90vw] md:max-w-full mx-auto px-4 pointer-events-none w-full">
                <span className="font-mono text-base md:text-lg uppercase tracking-[0.2em] text-white mb-8 text-center">
                    Where Manuals Meet Intelligence
                </span>

                <h1 className="text-7xl md:text-[10rem] lg:text-[13rem] font-sans font-bold text-center leading-[0.8] tracking-tighter">
                    The <span className="whitespace-nowrap">
                        S<FontSwap delay={1000} loopDuration={8000} pixelDuration={800}>u</FontSwap>perintellig<FontSwap delay={3000} loopDuration={8000} pixelDuration={800}>e</FontSwap>nce
                    </span>
                    <br />
                    Supp<FontSwap delay={5000} loopDuration={8000} pixelDuration={800}>o</FontSwap>rt Pl<FontSwap delay={7000} loopDuration={8000} pixelDuration={800}>a</FontSwap>tform
                </h1>


                {/* Rigid Spacer to force gap */}
                <div className="h-24 md:h-32 w-full"></div>

                <div className="flex flex-col sm:flex-row gap-4 items-center pointer-events-auto">
                    <button
                        onClick={() => handleNavigate(localStorage.getItem('token') ? '/chat' : '/login')}
                        style={{ backgroundColor: '#7c5cd6', color: '#ffffff' }}
                        className="px-8 py-4 font-mono text-sm uppercase font-bold hover:bg-[#b89ff9] transition-colors"
                    >
                        {localStorage.getItem('token') ? 'Go to Chat' : 'Enter the Experience'}
                    </button>
                    <button
                        onClick={() => handleNavigate('/team')}
                        className="px-8 py-4 border border-[#6236f4] text-[#a17ff7] bg-[#6236f4] bg-opacity-20 font-mono text-sm uppercase font-bold hover:!border-transparent hover:bg-opacity-30 transition-all"
                    >
                        Talk to our team
                    </button>
                </div>


            </div>
        </section>
    );
};

export default Hero;
