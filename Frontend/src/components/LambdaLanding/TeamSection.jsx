import React from 'react';
import { Link } from 'react-router-dom';
import ChromaGrid from '../ChromaGrid';
import dev1 from '../../assets/dev1.png';
import dev2 from '../../assets/dev2.png';
import dev3 from '../../assets/dev3.png';
import { LineShadowText } from '../ui/line-shadow-text';
import { Home } from 'lucide-react';
import { VideoText } from '../ui/video-text';


const TeamSection = () => {
    const items = [
        {
            image: dev1,
            title: "Apurv Sharma",
            subtitle: "Frontend Developer",
            handle: "@apurv",
            gradient: "linear-gradient(90deg, #6B46C1, #3182CE)", // purple-blue glow
            url: "https://github.com/apurvsharma7"
        },
        {
            image: dev2,
            title: "Rishi Thakkar",
            subtitle: "Backend Developer",
            handle: "@rishi",
            gradient: "linear-gradient(90deg, #059669, #10B981)", // green glow
            url: "https://github.com/rthakkar0555"
        },
        {
            image: dev3,
            title: "Malay Sheta",
            subtitle: "AI Developer",
            handle: "@malay",
            // orange glow gradient

            gradient: "linear-gradient(90deg, #EA580C, #F97316)",
            url: "https://github.com/malaysheta"
        }
    ];

    return (
        <div className="w-full max-w-screen-2xl mx-auto flex flex-col items-center relative">
            <div className="absolute top-8 left-4 md:left-8 z-50">
                <Link to="/" className="flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: '#1a1a1a', color: '#ffffff', outline: 'none', border: 'none', transition: 'background-color 0.2s', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'} title="Go to Home">
                    <Home size={24} />
                </Link>
            </div>

            {/* Hero Text Section (Full Screen) */}
            <section className="w-full min-h-screen flex flex-col items-center justify-center px-4 md:px-8">
                <div className="flex flex-col items-center w-full max-w-5xl mx-auto z-10 relative">
                    <h1
                        className="text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem] font-bold tracking-tight mb-12 text-center pb-6"
                        style={{ color: '#F0EBE1', lineHeight: '1.1' }}
                    >
                        Manuals are <span className="whitespace-nowrap"><LineShadowText className="italic" shadowColor="white">hard</LineShadowText>,</span> Answers are <span className="whitespace-nowrap"><LineShadowText className="italic" shadowColor="white">easy</LineShadowText>.</span>
                    </h1>

                    <div className="flex flex-col items-center text-[#A1A1AA] text-[13px] sm:text-[15px] font-mono leading-[1.8] text-center px-4 w-full">
                        <p className="mb-6 pb-6">
                            We started building Companion AI after noticing a common problem many people face: when a home appliance stops working, finding the right solution in long manuals or scattered information online can be frustrating and time-consuming. People often struggle to understand technical instructions or locate the exact fix they need.
                        </p>
                        <p className="mb-6 pb-6">
                            Companion AI was created to simplify that process. By combining intelligent search, contextual understanding, and conversational interaction, the system helps users quickly find the right guidance for troubleshooting their appliances.
                        </p>
                        <p>
                            Our mission is to make technical help as simple as asking a question. Companion AI transforms complex product manuals into clear, accessible answers, helping people diagnose and resolve issues faster through chat. From a single question to thousands of users, we are building an AI assistant designed to make everyday technology easier to understand and easier to fix.                        </p>
                    </div>
                </div>
            </section>

            <div className="relative h-[400px] w-full pb-40">
                <VideoText src="https://cdn.magicui.design/ocean-small.webm" fontSize={15}>CompanionAI</VideoText>
            </div>

            {/* Meet Our Team Component (Full Screen) */}
            <section className="w-full min-h-screen relative z-10 flex flex-col items-center justify-center px-4 md:px-8 pb-20">
                <ChromaGrid
                    items={items}
                    radius={300}
                    damping={0.45}
                    fadeOut={0.6}
                    ease="power3.out"
                />
            </section>
        </div>
    );
};

export default TeamSection;
