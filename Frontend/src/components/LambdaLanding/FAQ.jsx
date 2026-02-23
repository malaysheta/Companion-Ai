import React, { useState, useEffect, useRef } from 'react';
import './FAQ.css';
import PixelSnow from './PixelSnow';
import FadeContent from '../FadeContent';
import AnimatedContent from '../AnimatedContent';

// Proximity Text Component imported for performance
import ProximityText from '../ProximityText';

const faqData = [
    {
        question: "What is Companion AI?",
        answer: "Companion AI is an intelligent assistant designed to help you troubleshoot home appliances quickly and easily. Instead of reading long manuals or searching multiple websites, you can simply ask your question and receive clear, step-by-step guidance instantly."
    },
    {
        question: "How does Companion AI help with appliance issues?",
        answer: "Companion AI understands your problem and provides practical solutions based on official appliance information. It explains fixes in simple language and guides you through the troubleshooting process step by step."
    },
    {
        question: "What appliances does Companion AI support?",
        answer: "Companion AI supports a wide range of household appliances including washing machines, refrigerators, microwaves, air conditioners, and more. Support continues to expand as more appliance data is added."
    },
    {
        question: "Do I need technical knowledge to use Companion AI?",
        answer: "No technical knowledge is required. Companion AI is designed for everyday users and provides easy-to-understand instructions that anyone can follow."
    },
    {
        question: "Can I ask follow-up questions?",
        answer: "Yes. Companion AI allows natural conversation, so you can ask follow-up questions if something is unclear or if the issue continues. It keeps the conversation smooth and interactive."
    },
    {
        question: "Is Companion AI available anytime?",
        answer: "Yes. Companion AI is available 24/7, allowing you to get support whenever you need it — without waiting for customer service."
    },
    {
        question: "Is my data secure?",
        answer: "We prioritize user privacy and ensure that all interactions are handled securely. Your queries are processed safely and responsibly."
    },
    {
        question: "Is Companion AI free to use?",
        answer: "Companion AI is currently available as a project demonstration platform. Future versions may include additional features and service plans. Yes, Companion AI is free to use during the current development phase."
    }
];

const FAQItem = ({ question, answer, isOpen, onClick, index }) => {
    return (
        <div className="accordionItem">
            <div className="accordionItemNumberColumn">
                <h5>
                    <span className="text-lambda-beige">{String(index + 1).padStart(2, '0')}</span>
                    <span style={{ color: '#6236f4' }}>/</span>
                </h5>
            </div>
            <div className="accordionItemContentColumn">
                <div
                    className="accordionItemHeader"
                    role="button"
                    tabIndex="0"
                    data-locked="true"
                    onClick={onClick}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onClick();
                        }
                    }}
                >
                    <h5>{question}</h5>
                    <span className="accordionToggle">{isOpen ? '−' : '+'}</span>
                </div>
                <div className={`accordionItemContent ${isOpen ? 'accordionItemContentOpen' : ''}`}>
                    <div className="accordionItemRich">
                        <div>
                            <p>{answer}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="relative w-full bg-black py-24 px-8 md:px-16 lg:px-24">
            {/* Pixel Snow Background */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <PixelSnow
                    color="#a17ff7"
                    density={0.4}
                    speed={0.8}
                    variant="square"
                    brightness={1.5}
                    flakeSize={0.010}
                />
            </div>

            {/* Centered Header */}
            <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                <div className="w-full flex flex-col items-center mb-40">
                    <div className="w-full text-center">
                        <h2 className="text-6xl md:text-8xl font-sans font-bold text-lambda-beige mb-8 tracking-tighter leading-[0.9]">
                            <span style={{ color: '#a17ff7' }}><ProximityText>F</ProximityText></span>
                            <ProximityText>requently </ProximityText>
                            <span style={{ color: '#a17ff7' }}><ProximityText>A</ProximityText></span>
                            <ProximityText>sked</ProximityText>
                            <br />
                            <span style={{ color: '#a17ff7' }}><ProximityText>Q</ProximityText></span>
                            <ProximityText>uestions</ProximityText>
                            <ProximityText>.</ProximityText>
                        </h2>
                        <p className="text-gray-400 font-mono text-sm md:text-base w-full text-center">
                            Everything you need to know about Companion AI.
                        </p>
                    </div>
                </div>
            </FadeContent>

            {/* Spacer */}
            <div className="h-24"></div>

            {/* FAQ List */}
            <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                config={{ tension: 80, friction: 20 }}
                initialOpacity={0.2}
                animateOpacity
                scale={0.9}
                threshold={0.2}
                className="w-full max-w-8xl mx-auto"
            >
                <div className="w-full max-w-8xl mx-auto">
                    {faqData.map((item, index) => (
                        <FAQItem
                            key={index}
                            index={index}
                            question={item.question}
                            answer={item.answer}
                            isOpen={openIndex === index}
                            onClick={() => toggleFAQ(index)}
                        />
                    ))}
                </div>
            </AnimatedContent>

            {/* Spacer */}
            {/* <div className="h-4"></div> */}
        </section>
    );
};

export default FAQ;
