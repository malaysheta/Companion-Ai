import React from 'react';
import Navbar from '../components/LambdaLanding/Navbar';
import Hero from '../components/LambdaLanding/Hero';
import LambdaTerminal from '../components/LambdaLanding/LambdaTerminal';
import EdTechVideo from '../components/LambdaLanding/EdTechVideo';
import GlowingText from '../components/LambdaLanding/GlowingText';
import FAQ from '../components/LambdaLanding/FAQ';
import ContactSupport from '../components/LambdaLanding/ContactSupport';
import Footer from '../components/LambdaLanding/Footer';
import SmoothScroll from '../utils/SmoothScroll';
import CurvedLoop from '../components/CurvedLoop';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen bg-lambda-black overflow-x-hidden selection:bg-brand-green selection:text-black">
            <SmoothScroll />
            {/* Navigation */}
            <Navbar />

            {/* Lambda Terminal Overlay */}
            <LambdaTerminal />

            {/* Main Content */}
            <main>
                <Hero />
                <CurvedLoop />
                <GlowingText />
                <EdTechVideo />
                <FAQ />
                <ContactSupport />
                <CurvedLoop />
                <Footer />
                {/* Future sections (Features, Pricing, etc.) will go here */}
            </main>
        </div>
    );
};

export default LandingPage;
