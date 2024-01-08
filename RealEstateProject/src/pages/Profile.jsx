import React from 'react'
import Header from '../components/Header'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Profile = () => {
  const {currentUser} = useSelector(state => state.user)
  return (
    <div>
        <Header />
        <div className='flex justify-center align-center w-full h-auto mt-24 md:flex-row flex-col'>
        <div className='flex justify-center align-center p-8'>
          <img src={currentUser.avatar} className='border-25 rounded-full md:w-64 w-auto'/>
        </div>
        <form className='flex-col flex justify-center align-center text-center mx-24 gap-6 font-serif font-normal text-base md:w-64'>
          <h1 className='font-semibold text-4xl'>Profile</h1>
          <input placeholder={currentUser.username} type="text" id='username'></input>
          <input placeholder={currentUser.email} type="email" id='email'></input>
          <input placeholder="password" type="password" id='password'></input>
          <button className='border-2 rounded-sm bg-orange-500 border-amber-600'>Update</button>
          <button className=' border-2 rounded-sm border-amber-600 text-rose-600'>
            Delete Account!!
          </button>
          <span>
            Sign Out
          </span>
        </form>
      </div>
    </div>
  )
}

export default Profile