import React from 'react'
import { useNavigate } from 'react-router'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import './SignOut.css'

const SignOut = () => {
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut(auth)
        navigate('/SignIn')
    }

  return (
    <button className='button4' onClick={handleSignOut}>Sign Out</button>
  )
}

export default SignOut