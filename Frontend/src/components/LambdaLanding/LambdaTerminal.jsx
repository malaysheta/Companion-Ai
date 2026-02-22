import React, { useState, useEffect, useRef } from 'react';

const LambdaTerminal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [lines, setLines] = useState([]);
    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
        // Generate a session ID based on date
        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}${mm}${dd}`;
        setSessionId(`companion-ai-${formattedDate}-n41n`);

        const codeStyle = { fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1.5' };
        const keyStyle = { color: '#ff7b72' }; // Reddish for keys
        const stringStyle = { color: '#a5d6ff' }; // Light blue/green for strings
        const numberStyle = { color: '#79c0ff' }; // Blue for numbers
        const punctuationStyle = { color: '#e6edf3' }; // White for punctuation

        // JSON Content Component
        const JsonContent = () => (
            <div style={{ ...codeStyle, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere', textAlign: 'justify', paddingLeft: '20px', color: '#e6edf3' }}>
                <span style={punctuationStyle}>{'{'}</span>{'\n'}
                {'  '}<span style={keyStyle}>"page_type"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"webapp"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'  '}<span style={keyStyle}>"intent"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"connection"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'  '}<span style={keyStyle}>"description"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"A personal AI companion that listens, understands, and grows with you. Built for meaningful conversations, emotional support, and intelligent interaction."</span><span style={punctuationStyle}>,</span>{'\n'}
                {'  '}<span style={keyStyle}>"primary_cta"</span><span style={punctuationStyle}>: {'{'}</span>{'\n'}
                {'    '}<span style={keyStyle}>"text"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"Start Your Companion"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'    '}<span style={keyStyle}>"href"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"/create-companion"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'    '}<span style={keyStyle}>"location"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"hero"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'    '}<span style={keyStyle}>"confidence"</span><span style={punctuationStyle}>: </span><span style={numberStyle}>0.98</span>{'\n'}
                {'  '}<span style={punctuationStyle}>{'}'},</span>{'\n'}
                {'  '}<span style={keyStyle}>"zones"</span><span style={punctuationStyle}>: [</span>{'\n'}
                {'    '}<span style={punctuationStyle}>{'{'}</span>{'\n'}
                {'      '}<span style={keyStyle}>"id"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"hero"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'      '}<span style={keyStyle}>"intent"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"hook"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'      '}<span style={keyStyle}>"summary"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"Headline introducing intelligent personal companion experience. Focus on connection, intelligence, and emotional presence."</span>{'\n'}
                {'    '}<span style={punctuationStyle}>{'}'},</span>{'\n'}
                {'    '}<span style={punctuationStyle}>{'{'}</span>{'\n'}
                {'      '}<span style={keyStyle}>"id"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"personality-engine"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'      '}<span style={keyStyle}>"intent"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"educate"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'      '}<span style={keyStyle}>"summary"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"Explains customizable AI personality, memory system, and adaptive learning."</span>{'\n'}
                {'    '}<span style={punctuationStyle}>{'}'},</span>{'\n'}
                {'    '}<span style={punctuationStyle}>{'{'}</span>{'\n'}
                {'      '}<span style={keyStyle}>"id"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"real-time-interaction"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'      '}<span style={keyStyle}>"intent"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"engage"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'      '}<span style={keyStyle}>"summary"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"Live chat interface, voice interaction, contextual awareness."</span>{'\n'}
                {'    '}<span style={punctuationStyle}>{'}'},</span>{'\n'}
                {'    '}<span style={punctuationStyle}>{'{'}</span>{'\n'}
                {'      '}<span style={keyStyle}>"id"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"privacy"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'      '}<span style={keyStyle}>"intent"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"validate"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'      '}<span style={keyStyle}>"summary"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"Private, encrypted, user-controlled data."</span>{'\n'}
                {'    '}<span style={punctuationStyle}>{'}'},</span>{'\n'}
                {'    '}<span style={punctuationStyle}>{'{'}</span>{'\n'}
                {'      '}<span style={keyStyle}>"id"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"cta"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'      '}<span style={keyStyle}>"intent"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"convert"</span><span style={punctuationStyle}>,</span>{'\n'}
                {'      '}<span style={keyStyle}>"summary"</span><span style={punctuationStyle}>: </span><span style={stringStyle}>"Invite user to begin their personalized AI journey."</span>{'\n'}
                {'    '}<span style={punctuationStyle}>{'}'}</span>{'\n'}
                {'  '}<span style={punctuationStyle}>]</span>{'\n'}
                <span style={punctuationStyle}>{'}'}</span>
            </div>
        );

        // Initial lines sequence
        const initialLines = [
            { text: '', delay: 100 },
            { text: '', delay: 300 },
            { text: '> Session ID: ', suffix: 'SESSION_ID', delay: 400 },
            { text: '> [✓] Neural engine initialized', delay: 500, highlightCheck: true },
            { text: '> [✓] Emotional intelligence module active', delay: 600, highlightCheck: true },
            { text: '> [✓] Memory synchronization complete', delay: 700, highlightCheck: true },
            { text: '> [✓] Personality engine loaded', delay: 800, highlightCheck: true },
            { text: '> [✓] Human presence detected', delay: 900, highlightCheck: true },
            { text: '', delay: 1000 },
            { text: '> Preparing personalized interaction environment...', delay: 1100 },
            { text: '', delay: 1200 },
            // Insert JSON component
            { component: <JsonContent />, delay: 1300 },
            { text: '', delay: 3000 },
            { text: '> Status: READY', delay: 3100 },
            { text: '> Awaiting human interaction... ', cursor: true, delay: 3200 },
        ];

        let timeouts = [];

        if (isOpen) {
            setLines([]); // Reset lines on open
            initialLines.forEach((line, index) => {
                const timeout = setTimeout(() => {
                    setLines(prev => {
                        // Avoid duplicates if re-rendering
                        if (prev.length > index) return prev;
                        return [...prev, line];
                    });
                }, line.delay);
                timeouts.push(timeout);
            });
        } else {
            setLines([]);
        }

        return () => {
            timeouts.forEach(clearTimeout);
        };
    }, [isOpen]);

    return (
        <>
            {/* Collapsed Tab - Keeping style consistent but updating text */}
            <div
                className={`fixed top-1/2 right-0 transform -translate-y-1/2 translate-x-[calc(50%-30px)] rotate-[270deg] origin-center cursor-pointer z-[9999] transition-all duration-300 ${isOpen ? 'translate-x-full opacity-0 pointer-events-none' : 'translate-x-[calc(50%-35px)] opacity-100'}`}
                onClick={() => setIsOpen(true)}
                style={{
                    background: 'rgba(11, 11, 11, 0.4)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#e7e6d9'
                }}
            >
                <span className="font-lambda-mono text-xs tracking-widest whitespace-nowrap">// Companion Core Terminal //</span>
            </div>

            {/* Expanded Panel */}
            <div
                className={`fixed top-0 right-0 w-[450px] max-w-full h-full bg-black z-[10000] backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ backgroundColor: 'transparent' }}
            >
                <div className="flex items-center justify-between p-4 flex-shrink-0">
                    <h3 className="font-lambda-mono text-white tracking-widest" style={{ fontSize: '10px', margin: 0 }}>// Companion Core Terminal //</h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-white transition-colors"
                        aria-label="Close terminal"
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', boxShadow: 'none', color: '#ffffff', padding: '0 8px', fontSize: '14px' }}
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 font-lambda-mono text-xs leading-relaxed text-white/80 flex-1 overflow-y-auto overflow-x-hidden terminal-scroll text-justify" data-lenis-prevent>
                    {lines.map((line, i) => (
                        <div key={i} className={`mb-1 animate-fade-in ${line.className || ''}`} style={{ animationDuration: '0.1s' }}>
                            {line.component ? line.component : (
                                <>
                                    {line.text.startsWith('> [✓]') ? (
                                        <span>
                                            <span style={{ color: '#e7e6d9' }}>&gt; </span>
                                            <span style={{ color: '#37cd8f' }}>[✓]</span>
                                            <span style={{ color: '#e7e6d9' }}>{line.text.substring(5)}</span>
                                        </span>
                                    ) : (
                                        <span>
                                            {line.text}
                                            {line.suffix === 'SESSION_ID' && <span style={{ color: '#fbbf24' }}>{sessionId}</span>}
                                            {line.cursor && <span className="inline-block w-2 h-4 bg-brand-green ml-1 animate-pulse" style={{ backgroundColor: '#37cd8f' }}></span>}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                .terminal-scroll {
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* IE and Edge */
                }
                .terminal-scroll::-webkit-scrollbar {
                    display: none; /* Chrome, Safari, Opera */
                }
                .font-lambda-mono {
                    font-family: var(--font-mono, monospace);
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(2px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default LambdaTerminal;
