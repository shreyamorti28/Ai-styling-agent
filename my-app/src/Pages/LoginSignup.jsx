import React, { useState, useEffect } from 'react';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    fetchSignInMethodsForEmail,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { auth, storage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './CSS/LoginSignup.css';

const LoginSignup = ({ onLogout }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        
        const logoutUser = async () => {
            try {
                await signOut(auth);
                console.log('User logged out successfully.');
            } catch (error) {
                console.error('Error logging out:', error.message);
            }
        };
    
        logoutUser();
    }, []);

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkPasswordStrength(newPassword);
    };

    const checkPasswordStrength = (password) => {
        if (password.length < 6) {
            setPasswordStrength('Weak');
        } else if (password.length < 10) {
            setPasswordStrength('Medium');
        } else {
            setPasswordStrength('Strong');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoginMessage('');
        if (!termsAccepted) {
            setErrorMessage('You must accept the terms and conditions.');
            return;
        }
        setIsLoading(true);
        try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            if (methods.length > 0) {
                setErrorMessage('Account already exists with this email.');
                return;
            }
            await createUserWithEmailAndPassword(auth, email, password);
            setLoginMessage('Sign up successful! Please log in.');
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in:', userCredential.user.uid);
            setIsAuthenticated(true);
            navigate('/wardrobe');
            setEmail('');
            setPassword('');
            setPasswordStrength('');


        } catch (error) {
            console.error('Error during signup:', error.message);
            setErrorMessage('Signup failed. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoginMessage('');
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in:', userCredential.user.uid);
            setIsAuthenticated(true);
            navigate('/wardrobe');
        } catch (error) {
            console.error('Error during login:', error.message);
            setErrorMessage('Incorrect email or password.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setErrorMessage('Please enter your email to reset the password.');
            return;
        }
        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setLoginMessage('Password reset email sent. Check your inbox.');
        } catch (error) {
            console.error('Error sending reset email:', error.message);
            setErrorMessage('Failed to send reset email. Check your email address.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleToSignup = () => {
        setIsLogin(false);
        resetForm();
    };

    const toggleToLogin = () => {
        setIsLogin(true);
        resetForm();
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setPasswordStrength('');
        setErrorMessage('');
        setLoginMessage('');
        setTermsAccepted(false);
    };

    const handleRememberMe = (e) => setRememberMe(e.target.checked);
    const handleTermsChange = (e) => setTermsAccepted(e.target.checked);

    return (
        <div className='login-container'>
            {isLoading && <div className="loading-spinner">Loading...</div>}
            {isLogin ? (
                <div>
                    <h1>Login</h1>
                    <form onSubmit={handleLogin}>
                        <label>Email:
                            <input type="email" value={email} onChange={handleEmailChange} required />
                        </label>
                        <label>Password:
                            <input type="password" value={password} onChange={handlePasswordChange} required />
                        </label>
                        <label>
                            <input type="checkbox" checked={rememberMe} onChange={handleRememberMe} />
                            Remember Me
                        </label>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button type="submit">Login</button>
                    </form>
                    <p>
                        Don't have an account?{' '}
                        <span onClick={toggleToSignup} className="toggle-link">
                            Sign up
                        </span>
                    </p>
                </div>
            ) : (
                <div>
                    <h1>Sign Up</h1>
                    <form onSubmit={handleSignup}>
                        <label>Email:
                            <input type="email" value={email} onChange={handleEmailChange} required />
                        </label>
                        <label>Password:
                            <input type="password" value={password} onChange={handlePasswordChange} required />
                        </label>
                        <label>
                            <input type="checkbox" checked={termsAccepted} onChange={handleTermsChange} required />
                            I accept the Terms and Conditions
                        </label>
                        {passwordStrength && <p className="password-strength">Password Strength: {passwordStrength}</p>}
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button type="submit">Sign Up</button>
                    </form>
                    <p>
                        Already have an account?{' '}
                        <span onClick={toggleToLogin} className="toggle-link">
                            Log in
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default LoginSignup;
