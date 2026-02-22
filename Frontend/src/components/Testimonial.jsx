import React, { useRef } from 'react';
import VariableProximity from './VariableProximity';
const Testimonial = () => {
    const containerRef = useRef(null);
    return (
        <div style={styles.container} ref={containerRef}>
            <div style={{ ...styles.content, position: 'relative', zIndex: 1 }}>
                <div style={styles.avatarContainer}>
                    <img
                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                        alt="User"
                        style={styles.avatar}
                    />
                </div>
                <blockquote style={styles.quote}>
                    <span style={styles.quoteMark}>❝</span>
                    <VariableProximity
                        label="Companion AI has been a "
                        className="variable-proximity-demo"
                        fromFontVariationSettings="'wght' 400, 'opsz' 9"
                        toFontVariationSettings="'wght' 900, 'opsz' 40"
                        containerRef={containerRef}
                        radius={100}
                        falloff="linear"
                    />
                    <span style={styles.highlight}>
                        <VariableProximity
                            label="total lifesaver"
                            className="variable-proximity-demo"
                            fromFontVariationSettings="'wght' 700, 'opsz' 9"
                            toFontVariationSettings="'wght' 1000, 'opsz' 40"
                            containerRef={containerRef}
                            radius={100}
                            falloff="linear"
                        />
                    </span>
                    <VariableProximity
                        label=" for me. I’m great at building ideas, but figuring things out from long manuals or technical guides has never been my strength. With Companion AI, I get clear help instantly, without the stress or confusion. It saves me time, removes frustration, and makes solving problems feel effortless."
                        className="variable-proximity-demo"
                        fromFontVariationSettings="'wght' 400, 'opsz' 9"
                        toFontVariationSettings="'wght' 900, 'opsz' 40"
                        containerRef={containerRef}
                        radius={100}
                        falloff="linear"
                    />
                    <span style={styles.quoteMark}>❞</span>
                </blockquote>
                <div style={styles.author}>
                    <div style={styles.name}>
                        <VariableProximity
                            label="User of Companion AI"
                            className="variable-proximity-demo"
                            fromFontVariationSettings="'wght' 600, 'opsz' 9"
                            toFontVariationSettings="'wght' 1000, 'opsz' 40"
                            containerRef={containerRef}
                            radius={50}
                            falloff="linear"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: 'var(--bg-secondary)',
        height: '95%',
        width: '95%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem',
        borderRadius: '2rem',
        position: 'relative',
        overflow: 'hidden',
        margin: 'auto',
    },
    content: {
        maxWidth: '500px',
        textAlign: 'center',
    },
    avatarContainer: {
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'center',
    },
    avatar: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '4px solid var(--card-bg)',
        boxShadow: '0 4px 6px -1px var(--shadow-color)',
    },
    quote: {
        fontSize: '1.25rem',
        lineHeight: '1.6',
        fontWeight: '500',
        color: 'var(--text-primary)',
        marginBottom: '2rem',
        position: 'relative',
    },
    quoteMark: {
        color: '#F97316',
        fontSize: '1.5rem',
        margin: '0 0.25rem',
    },
    highlight: {
        backgroundColor: '#F97316',
        color: '#fff',
        padding: '0.1rem 0.4rem',
        borderRadius: '4px',
        transform: 'skewX(-3deg)',
        display: 'inline-block',
    },
    author: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    name: {
        fontWeight: '700',
        color: 'var(--text-secondary)',
        fontSize: '1rem',
    }
};

export default Testimonial;
