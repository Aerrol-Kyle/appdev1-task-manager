import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './SignUp.css';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSignUp = async () => {
        if (!email || !password) {
            setError('Email and Password cannot be empty.');
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    return (
        <div className="auth-container">
            <h1>Sign Up</h1>
            <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className='button1'onClick={handleSignUp}>Sign up</button>
            {error && <p className="error">{error}</p>}
            <p className='p1'>
                Already have an account? <Link to="/SignIn">Sign in</Link>
            </p>
        </div>
    );
};

export default SignUp;
