import React from 'react';

const FooterLinks = () => {
    return (
        <footer className="footer-container">
            <div className="footer-column">
                <div style={styles.logoContainer}>
                    <div style={styles.logoIcon}></div>
                    <span style={styles.logoText}>Companion AI</span>
                </div>
                <p style={styles.description}>
                    Your one-stop solution for creating stunning user interfaces, whether you're a seasoned pro or just getting started.
                </p>
                <div style={styles.copyright}>
                    © 2026 Companion AI. All rights reserved.
                </div>
            </div>

            <div className="footer-column">
                <h4 style={styles.heading}>Links</h4>
                <div style={styles.linkList}>
                    <a href="#" style={styles.link}>Components</a>
                    <a href="#" style={styles.link}>Templates</a>
                    <a href="#" style={styles.link}>Pricing</a>
                    <a href="#" style={styles.link}>Contact</a>
                    <a href="#" style={styles.link}>Sign in</a>
                    <a href="#" style={styles.link}>Sign up</a>
                </div>
            </div>

            <div className="footer-column">
                <h4 style={styles.heading}>Legal</h4>
                <div style={styles.linkList}>
                    <a href="#" style={styles.link}>Privacy policy</a>
                    <a href="#" style={styles.link}>Terms of service</a>
                </div>
            </div>

            <div style={styles.closeIcon}>
                ✕
            </div>

            {/* Adding inline style tag for footer specific media query since we aren't using CSS modules for now 
            and I want to keep the component somewhat self-contained or I can add to index.css
            Let's add to index.css for consistency, but for now using a pattern to be safe.
            I will use index.css for the classes I added: footer-container, footer-column
        */}
        </footer>
    );
};

const styles = {
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.5rem',
    },
    logoIcon: {
        width: '24px',
        height: '24px',
        backgroundColor: 'var(--text-primary)',
        borderRadius: '6px',
        position: 'relative',
    },
    logoText: {
        fontWeight: '600',
        fontSize: '1.125rem',
        color: 'var(--text-primary)',
    },
    description: {
        color: 'var(--text-tertiary)',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        marginBottom: '2rem',
    },
    copyright: {
        color: 'var(--text-tertiary)',
        fontSize: '0.8rem',
    },
    heading: {
        fontSize: '0.95rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '0.5rem',
    },
    linkList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    link: {
        textDecoration: 'none',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
    },
    closeIcon: {
        fontSize: '1.2rem',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        alignSelf: 'flex-start'
    }
};

export default FooterLinks;
