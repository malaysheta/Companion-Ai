import React, { useState, useEffect, useRef } from 'react';
import { Play, Share2, Youtube } from 'lucide-react';
import FadeContent from '../FadeContent';
import AnimatedContent from '../AnimatedContent';
import PixelSnow from './PixelSnow';

// Proximity Text Component imported for performance
import ProximityText from '../ProximityText';

const EdTechVideo = () => {
    return (
        <section className="relative w-full px-4 md:px-8 flex flex-col items-center justify-center bg-black text-white z-10 overflow-hidden">

            {/* Pixel Snow Background */}
            <div className="absolute inset-0 z-0 opacity-40">
                <PixelSnow
                    color="#a17ff7"
                    variant="snowflake"
                    density={0.4}
                    speed={0.8}
                    brightness={1.5}
                    // pixelResolution={150}
                    flakeSize={0.010}
                />
            </div>

            {/* Content Container to ensure it sits above background */}
            <div className="relative z-10 flex flex-col items-center w-full">
                {/* Heading */}
                <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                    <h2 className="text-4xl md:text-6xl font-sans font-bold text-center mb-6 tracking-tight">
                        <ProximityText>Not Just an </ProximityText>
                        <span className="text-[#a17ff7]"><ProximityText>AI</ProximityText></span>
                        <ProximityText>.</ProximityText>
                        <br />
                        <ProximityText>A </ProximityText>
                        <span className="text-[#a17ff7] relative inline-block">
                            <ProximityText>Companion</ProximityText>
                            <ProximityText>.</ProximityText>
                            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#a17ff7] rounded-full"></span>
                        </span>
                    </h2>
                </FadeContent>
                <div className="w-full h-12"></div>
                {/* Subtext */}
                <FadeContent blur={true} duration={1000} delay={200} easing="ease-out" initialOpacity={0}>
                    <p className="text-gray-400 text-center max-w-3xl mb-20 text-lg md:text-xl leading-relaxed">
                        Transform the way you solve appliance problems with our AI-powered companion that delivers <span className="text-[#a17ff7]">fast, reliable, and easy-to-understand solutions</span> — anytime you need them.
                    </p>
                </FadeContent>

                {/* Rigid Spacer */}
                <div className="w-full h-32"></div>

                {/* Video Player Container */}
                <AnimatedContent
                    distance={50}
                    direction="vertical"
                    reverse={false}
                    config={{ tension: 80, friction: 20 }}
                    initialOpacity={0.2}
                    animateOpacity
                    scale={0.9}
                    threshold={0.2}
                    className="w-full max-w-5xl flex justify-center"
                >
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(161,127,247,0.1)] border border-white/10 group cursor-pointer bg-gradient-to-br from-gray-900 to-black">
                        {/* Simulated Thumbnail/Video Overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(161,127,247,0.15),transparent_70%)] opacity-60"></div>

                        {/* Dots Pattern Overlay */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(161,127,247,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        {/* Top Controls */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20 bg-gradient-to-b from-black/80 to-transparent">
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg shadow-lg">
                                    <span className="italic">L</span>
                                </div>
                                <span className="font-medium text-lg drop-shadow-md">Companion AI - A NextGen Platform</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 text-white hover:text-brand-purple transition-colors cursor-pointer">
                                <Share2 size={24} />
                                <span className="text-xs uppercase font-bold tracking-wider">Share</span>
                            </div>
                        </div>

                        {/* Center Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="relative group-hover:scale-110 transition-transform duration-300">
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-brand-purple blur-3xl opacity-30 group-hover:opacity-50 transition-opacity rounded-full"></div>
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-brand-purple rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(161,127,247,0.4)] z-10 relative">
                                    <Play size={36} className="text-black fill-current ml-1" />
                                </div>
                                {/* Ripple rings */}
                                <div className="absolute inset-0 border-2 border-[#a17ff7]/30 rounded-full w-full h-full animate-ping opacity-50"></div>
                                <div className="absolute inset-[-12px] border border-[#a17ff7]/20 rounded-full w-[calc(100%+24px)] h-[calc(100%+24px)]"></div>
                            </div>

                            {/* Centered Text behind button */}
                            <div className="absolute text-center z-0 opacity-80 select-none pointer-events-none transform scale-150">
                                <span className="text-6xl md:text-8xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white/10 to-white/30 blur-sm">
                                    CompanionAI
                                </span>
                            </div>
                        </div>

                        {/* Bottom Controls */}
                        <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end z-20 bg-gradient-to-t from-black/90 to-transparent">
                            <div className="flex items-center gap-2 text-white/80 hover:text-brand-purple transition-colors cursor-pointer bg-black/40 px-3 py-1 rounded backdrop-blur-sm">
                                <span className="text-sm font-medium">Watch on</span>
                                <Youtube size={20} className="text-white" />
                                <span className="text-sm font-bold">YouTube</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_red]"></span>
                                <span className="text-white font-mono text-sm">2:34</span>
                            </div>
                        </div>
                    </div>
                </AnimatedContent>


            </div>
        </section>
    );
};

export default EdTechVideo;
