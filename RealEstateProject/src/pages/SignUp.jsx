import React from 'react'
import Header from '../components/Header'
import signUpImg from "../assets/signUpImg.webp"
import { Link } from 'react-router-dom'
const SignUp = () => {
  return (
    <div>
      <Header />
      <div className='flex justify-center align-center w-full h-auto mt-24'>
        <div className='hidden md:flex'>
          <img src={signUpImg} className='border-25 rounded-lg'/>
        </div>
        <form className='flex-col flex justify-center align-center text-center mx-24 gap-6 font-serif font-normal text-base'>
          <h1 className='font-semibold text-4xl'>Sign Up</h1>
          <input placeholder='Username' type="text"></input>
          <input placeholder='E-mail' type="text"></input>
          <input placeholder='Password' type="password"></input>
          <button className='border-2 rounded-sm bg-orange-500 border-amber-600'>Sign Up</button>
          <span>Have an account?
            <Link to='/sign-in' className='text-cyan-400'> Sign In</Link>.
          </span>
        </form>
      </div>
    </div>
  )
}

export default SignUp