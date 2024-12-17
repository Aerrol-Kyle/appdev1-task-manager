import React, { useState } from 'react'
import { Link } from 'react-router'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router'
import { googleProvider, auth } from '../firebase'
import './SignIn.css'

const SignIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const handleSignIn = async () => {
        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }
        
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/')
        } catch (error) {
            setError(`Error: ${error.message}`)
        }
    }

    const handleSignInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            navigate('/')
        } catch (error) {
            setError(`Error: ${error.message}`)
        }
    }

    return (
        <div className="auth-container">
            <h1>Sign In</h1>
            <input
                type="email"
                placeholder="Email..."
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password..."
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className='button2' onClick={handleSignIn}>Sign In</button>
            {' or '}
            <button className='button3' onClick={handleSignInWithGoogle}>Sign In with Gmail</button>
            {error && <p className="error">{error}</p>}
            <p>
                Don't have an account? <Link to="/SignUp">Sign Up</Link>
            </p>
        </div>
    )
}

export default SignIn