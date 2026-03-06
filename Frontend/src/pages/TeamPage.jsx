import React from 'react';
import TeamSection from '../components/LambdaLanding/TeamSection';
import SmoothScroll from '../utils/SmoothScroll';

const TeamPage = () => {
    return (
        <div className="relative min-h-screen w-full bg-black overflow-x-hidden selection:bg-[#B19EEF] selection:text-black">
            <SmoothScroll />
            <main className="w-full flex justify-center">
                <TeamSection />
            </main>
        </div>
    );
};

export default TeamPage;
