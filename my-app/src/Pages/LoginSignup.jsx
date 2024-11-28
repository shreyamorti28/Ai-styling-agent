import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, fetchSignInMethodsForEmail } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; 
import { auth, storage } from '../firebase'; 
import { useNavigate } from 'react-router-dom';  // Import useNavigate
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

    const navigate = useNavigate();  // Initialize navigate

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        });
        return () => unsubscribe();
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
        try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            if (methods.length > 0) {
                setErrorMessage('Account already exists with this email.');
                return;
            }
            await createUserWithEmailAndPassword(auth, email, password);
            setLoginMessage('Sign up successful! Please log in.');
            setEmail('');
            setPassword('');
            setPasswordStrength('');
        } catch (error) {
            console.error('Error during signup:', error.message);
            if (error.message.includes('auth/weak-password')) {
                setErrorMessage('Password should be at least 6 characters.');
            } else {
                setErrorMessage('Signup failed. check if Account already exists with this email.');
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoginMessage('');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User logged in:', user.uid);
            setIsAuthenticated(true);
            setEmail('');
            setPassword('');
            setPasswordStrength('');
            navigate('/wardrobe'); // Redirect to Wardrobe page after successful login
        } catch (error) {
            console.error('Error during login:', error.message);
            setErrorMessage('Incorrect email or password.');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) {
            alert('Please select an image to upload.');
            return;
        }
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const imageRef = ref(storage, `images/${userId}/${uuidv4()}`);
                const snapshot = await uploadBytes(imageRef, selectedImage);
                const downloadUrl = await getDownloadURL(snapshot.ref);
                setUploadedImageUrl(downloadUrl);
                alert('Image uploaded successfully!');
            } else {
                alert('No user is signed in.');
            }
        } catch (error) {
            console.error('Error uploading image:', error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsAuthenticated(false);
            setLoginMessage('');
            onLogout();
        } catch (error) {
            console.error('Error during logout:', error.message);
        }
    };

    const toggleToSignup = () => {
        setIsLogin(false);
        setEmail('');
        setPassword('');
        setPasswordStrength('');
        setErrorMessage('');
        setLoginMessage('');
    };

    const toggleToLogin = () => {
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setPasswordStrength('');
        setErrorMessage('');
        setLoginMessage('');
    };

    return (
        <div className='login-container'>
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
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button type="submit">Login</button>
                    </form>
                    <p>
                        Don't have an account?{' '}
                        <span onClick={toggleToSignup} className="toggle-link">
                            Sign up
                        </span>
                    </p>
                    {loginMessage && <p className="success-message">{loginMessage}</p>}
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
