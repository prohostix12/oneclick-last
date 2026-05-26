"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Logo from '../../components/Logo';

export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('adminAuth') === 'true';
        if (isLoggedIn) {
            router.push('/admin');
        }
    }, [router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('adminAuth', 'true');
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                router.push('/admin');
            } else {
                setError(data.error || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Failed to connect to server');
        }
        
        setIsLoading(false);
    };

    return (
        <div className="login-page">
            <style jsx global>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #000;
                    color: white;
                }

                .login-page {
                    display: flex;
                    min-height: 100vh;
                    background: #000;
                }

                .login-left {
                    flex: 1.2;
                    background: #000;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 2.5rem;
                    position: relative;
                }

                .login-right {
                    flex: 1;
                    background-image: url('/admin-billboard.png');
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }

                .login-right::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to left, rgba(12, 12, 12,0.1), rgba(12, 12, 12,0.4));
                }

                .login-form-container {
                    max-width: 380px;
                    width: 100%;
                    margin: 0 auto;
                }

                .login-logo {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 2rem;

                    font-family: 'Bricolage Grotesque', sans-serif;
                    font-weight: 800;
                    font-size: 1.3rem;
                }

                .login-title {
                    font-size: 2rem;
                    font-weight: 800;
                    margin-bottom: 0.4rem;
                    letter-spacing: -1px;
                }

                .login-subtitle {
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 2rem;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .form-group {
                    margin-bottom: 1.2rem;
                }

                .form-input {
                    width: 100%;
                    padding: 0.95rem 1.2rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    color: white;
                    font-size: 0.95rem;
                    outline: none;
                    transition: all 0.6s ease;
                }

                .form-input:focus {
                    background: rgba(255,255,255,0.08);
                    border-color: #e61e25;
                }

                .password-container {
                    position: relative;
                }

                .password-toggle {
                    position: absolute;
                    right: 1.1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: rgba(255,255,255,0.4);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }

                .sign-in-button {
                    width: 100%;
                    padding: 1rem;
                    background: #e61e25;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.6s;
                    margin-top: 1.2rem;
                }

                .sign-in-button:hover {
                    background: #ff2a31;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(230, 30, 37, 0.3);
                }

                .divider {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin: 1.5rem 0;
                    color: rgba(255,255,255,0.3);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .divider::before, .divider::after {
                    content: '';
                    height: 1px;
                    flex: 1;
                    background: rgba(255,255,255,0.1);
                }

                .social-buttons {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.8rem;
                }

                .social-button {
                    flex: 1;
                    padding: 0.8rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.6s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .social-button:hover {
                    background: rgba(255,255,255,0.1);
                }

                .create-account {
                    text-align: center;
                    color: rgba(255,255,255,0.5);
                    font-size: 0.95rem;
                }

                .create-account a {
                    color: #e61e25;
                    text-decoration: none;
                    font-weight: 700;
                }

                .keep-logged-in {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    margin: 1.2rem 0;
                    color: rgba(255,255,255,0.6);
                    font-size: 0.85rem;
                    cursor: pointer;
                }

                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #FCA5A5;
                    padding: 0.7rem 1rem;
                    border-radius: 10px;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                    text-align: center;
                }

                @media (max-width: 1024px) {
                    .login-right {
                        display: none;
                    }
                    .login-left {
                        flex: 1;
                        padding: 3rem 1.5rem;
                    }
                    .login-form-container {
                        max-width: 400px;
                        background: rgba(255,255,255,0.02);
                        padding: 2.5rem;
                        border-radius: 24px;
                        border: 1px solid rgba(255,255,255,0.05);
                    }
                }

                @media (max-width: 480px) {
                    .login-form-container {
                        padding: 1.5rem;
                        background: transparent;
                        border: none;
                    }
                    .login-title {
                        font-size: 2rem;
                    }
                }
            `}</style>

            <div className="login-left">
                <Link href="/" style={{
                    position: 'absolute',
                    top: '2rem',
                    left: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    transition: 'all 0.3s'
                }} className="back-btn"
                   onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                   onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                >
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <div className="login-form-container">
                    <div className="login-logo">
                        <Logo size="medium" showFullText={false} />
                    </div>

                    <h1 className="login-title">Sign in</h1>
                    <p className="login-subtitle">Please login to continue to your account.</p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="email"
                                name="username"
                                autoComplete="username"
                                placeholder="Email"
                                className="form-input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <div className="password-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="form-input"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <label className="keep-logged-in">
                            <input
                                type="checkbox"
                                checked={keepLoggedIn}
                                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                            />
                            Keep me logged in
                        </label>

                        <button
                            type="submit"
                            className="sign-in-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>

                    </form>
                </div>
            </div>

            <div className="login-right"></div>
        </div>
    );
}
