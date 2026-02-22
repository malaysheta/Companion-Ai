import React, { useRef } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import VariableProximity from './VariableProximity';

const Navbar = ({ theme, toggleTheme }) => {
  const containerRef = useRef(null);

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer} ref={containerRef}>
        <VariableProximity
          label="Companion AI"
          className="variable-proximity-demo"
          fromFontVariationSettings="'wght' 400, 'opsz' 9"
          toFontVariationSettings="'wght' 1000, 'opsz' 40"
          containerRef={containerRef}
          radius={100}
          falloff="linear"
          style={{
            fontSize: '1.5rem',
            color: 'var(--text-primary)',
            cursor: 'default'
          }}
        />
      </div>

      <div style={styles.links}>
        <a href="#" style={styles.link}>Demo</a>
        <a href="#" style={styles.link}>Contact</a>
        <span style={styles.divider}></span>
        <a href="#" style={styles.link}>Sign in</a>
        <button style={styles.ctaButton}>Get all Access</button>
        <button onClick={toggleTheme} style={styles.themeToggle} aria-label="Toggle Theme">
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 4rem',
    backgroundColor: 'var(--nav-bg)',
    fontFamily: "'Outfit', sans-serif",
    borderBottom: '1px solid var(--border-color)',
    transition: 'background-color 0.3s ease',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    width: '24px',
    height: '24px',
    backgroundColor: '#000', // You might want this to change in dark mode too? Let's keep distinct or invert.
    // Let's make it follow text color for simplicity or keep black if brand color.
    // If it's a solid block, maybe var(--text-primary)? 
    backgroundColor: 'var(--text-primary)',
    borderRadius: '6px',
    position: 'relative',
  },
  logoText: {
    fontWeight: '600',
    fontSize: '1.125rem',
    color: 'var(--text-primary)',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  link: {
    textDecoration: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  newBadge: {
    backgroundColor: '#DCFCE7', // Keep standard or make var?
    color: '#166534',
    // For dark mode, these might need adjustment or opacity.
    // Let's leave hardcoded for now or use vars if critical.
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.7rem',
    padding: '1px 6px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  divider: {
    width: '1px',
    height: '1.5rem',
    backgroundColor: 'var(--divider-color)',
    display: 'block',
  },
  ctaButton: {
    backgroundColor: 'var(--btn-bg)',
    color: 'var(--btn-text)',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  themeToggle: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem',
    borderRadius: '50%',
    transition: 'color 0.3s ease, background-color 0.3s ease',
  }
};

export default Navbar;
