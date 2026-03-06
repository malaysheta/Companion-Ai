import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import './AuthPageCustom.css';

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(location.pathname === '/login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLogin(location.pathname === '/login');
        setError(null);

        if (localStorage.getItem('token')) {
            navigate('/chat', { replace: true });
        }
    }, [location.pathname, navigate]);

    const toggleMode = (e) => {
        e.preventDefault();
        const nextModeIsLogin = !isLogin;
        setIsLogin(nextModeIsLogin);
        setError(null);
        navigate(nextModeIsLogin ? '/login' : '/signup', { replace: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // IMPORTANT: According to FastAPI login expects username to be used.
                // We're passing email as username here.
                const response = await apiService.login(email, password);
                localStorage.setItem('token', response.access_token);
                console.log('Login successful');
            } else {
                await apiService.register({ username: name, email, password });
                console.log('Signup successful, proceeding to login');
                // Auto login after signup
                const response = await apiService.login(email, password);
                localStorage.setItem('token', response.access_token);
            }
            navigate('/chat');
        } catch (err) {
            setError(err.message || 'An error occurred during authentication.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="custom-auth-container">
            <div className="custom-auth-wrapper">
                {/* Left Side: Form */}
                <div className="custom-auth-left">
                    <div className="custom-form-container">
                        <h1 className="custom-header">
                            {isLogin ? 'Sign in to Companion AI' : 'Sign up to Companion AI'}
                        </h1>
                        <p className="custom-subtext">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <span onClick={toggleMode} className="custom-link">
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </span>
                        </p>

                        <form onSubmit={handleSubmit} className="custom-auth-form">
                            {error && (
                                <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
                                    {error}
                                </div>
                            )}
                            {!isLogin && (
                                <div>
                                    <label className="custom-label">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="custom-input"
                                        disabled={isLoading}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="custom-label">Email address</label>
                                <input
                                    type="email"
                                    placeholder="Enter email to get started"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="custom-input"
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div>
                                <label className="custom-label">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="custom-input"
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <button type="submit" className="custom-submit-btn" disabled={isLoading}>
                                {isLoading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
                            </button>
                        </form>

                        <div className="custom-divider">
                            <span className="custom-divider-text">Or continue with</span>
                            <div className="custom-divider-line"></div>
                        </div>

                        <div className="custom-social-grid">
                            <button className="custom-social-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </button>
                            <button className="custom-social-btn">
                                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </button>
                            <button className="custom-social-btn">
                                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <p className="custom-footer">
                            By creating an account you agree with our
                            <br />
                            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                        </p>
                    </div>
                </div>

                {/* Right Side: Testimonial - simplified for CSS compatibility */}
                <div className="custom-auth-right">
                    <div className="custom-testimonial-box">
                        <div style={{ marginBottom: '24px', position: 'relative', paddingTop: '10px', paddingBottom: '10px' }}>
                            <span style={{ fontSize: '60px', color: '#f97316', position: 'absolute', top: '-5px', left: '-20px', lineHeight: 1, fontFamily: 'serif' }}>“</span>
                            <blockquote style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', lineHeight: '1.5', position: 'relative', zIndex: 10, marginLeft: '20px' }}>
                                Companion AI has been a <span style={{ backgroundColor: '#f97316', color: 'white', padding: '2px 8px', borderRadius: '4px', transform: 'rotate(-1deg)', display: 'inline-block', boxShadow: '0 2px 5px rgba(249, 115, 22, 0.2)' }}>total lifesaver</span> for me. Figuring things out from long manuals or technical guides has never been my strength. With Companion AI, I get clear help instantly, without the stress or confusion. It saves me time, removes frustration, and makes solving problems feel effortless.
                            </blockquote>
                            <span style={{ fontSize: '60px', color: '#f97316', position: 'absolute', bottom: '-15px', right: '-10px', lineHeight: 1, fontFamily: 'serif' }}>”</span>
                        </div>

                        <div style={{ marginTop: '16px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#ffffff' }}>— User of Companion AI</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
