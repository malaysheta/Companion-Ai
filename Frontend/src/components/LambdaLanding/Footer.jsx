import React from 'react';
import DotGrid from './DotGrid';
import FadeContent from '../FadeContent';

const Footer = () => {
    return (
        <footer className="relative overflow-hidden w-full bg-[#000000] border-t border-[rgba(255,255,255,0.05)] pt-16 pb-8 px-4 sm:px-8 lg:px-16">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <DotGrid />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
                {/* Brand Section */}
                <div className="flex flex-col max-w-sm">
                    <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                        <span className="text-2xl font-sans font-bold text-white mb-4 block">Companion AI</span>
                        <p className="text-white/60 font-sans text-sm leading-relaxed">
                            Your intelligent partner for navigating the future. We build tools that make learning and working seamless, intuitive, and powerful.
                        </p>
                    </FadeContent>
                </div>

                {/* Links Section */}
                <div className="flex flex-col sm:flex-row gap-12 sm:gap-24">
                    <div className="flex flex-col">
                        <FadeContent blur={true} duration={1000} delay={100} easing="ease-out" initialOpacity={0}>
                            <span className="text-white font-sans font-semibold mb-4 text-base block">Platform</span>
                            <div className="flex flex-col gap-3">
                                <a href="#" className="text-white/60 hover:text-white transition-colors font-sans text-sm">Experience</a>
                                <a href="#" className="text-white/60 hover:text-white transition-colors font-sans text-sm">FAQ</a>
                                <a href="#" className="text-white/60 hover:text-white transition-colors font-sans text-sm">Features</a>
                            </div>
                        </FadeContent>
                    </div>

                    <div className="flex flex-col">
                        <FadeContent blur={true} duration={1000} delay={200} easing="ease-out" initialOpacity={0}>
                            <span className="text-white font-sans font-semibold mb-4 text-base block">Company</span>
                            <div className="flex flex-col gap-3">
                                <a href="#" className="text-white/60 hover:text-white transition-colors font-sans text-sm">About</a>
                                <a href="#" className="text-white/60 hover:text-white transition-colors font-sans text-sm">Blog</a>
                                <a href="#" className="text-white/60 hover:text-white transition-colors font-sans text-sm">Careers</a>
                                <a href="#" className="text-white/60 hover:text-white transition-colors font-sans text-sm">Contact</a>
                            </div>
                        </FadeContent>
                    </div>

                    <div className="flex flex-col">
                        <FadeContent blur={true} duration={1000} delay={300} easing="ease-out" initialOpacity={0}>
                            <span className="text-white font-sans font-semibold mb-4 text-base block">Legal</span>
                            <div className="flex flex-col gap-3">
                                <a href="#" className="text-white/60 hover:text-white transition-colors font-sans text-sm">Privacy Policy</a>
                                <a href="#" className="text-white/60 hover:text-white transition-colors font-sans text-sm">Terms of Service</a>
                            </div>
                        </FadeContent>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="relative z-10 max-w-7xl mx-auto mt-16 pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row justify-between items-center gap-4">
                <FadeContent blur={true} duration={1000} delay={400} easing="ease-out" initialOpacity={0}>
                    <p className="text-white/40 font-sans text-sm">
                        © {new Date().getFullYear()} Companion AI. All rights reserved.
                    </p>
                </FadeContent>

                <FadeContent blur={true} duration={1000} delay={500} easing="ease-out" initialOpacity={0}>
                    <div className="flex gap-6">
                        <a href="#" className="text-white/40 hover:text-white transition-colors">
                            <span className="sr-only">Twitter</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </a>
                        <a href="#" className="text-white/40 hover:text-white transition-colors">
                            <span className="sr-only">GitHub</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </FadeContent>
            </div>
            <div className="h-8 md:h-8 w-full"></div>
        </footer>
    );
};

export default Footer;
