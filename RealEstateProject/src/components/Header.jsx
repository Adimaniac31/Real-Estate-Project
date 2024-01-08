import React from 'react';
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
const Header = () => {
  const {currentUser} = useSelector(state => state.user)

  return (
    <div className='flex justify-between p-4 bg-amber-400'>
        <h2 className='flex font-serif font-bold text-slate-700 text-sm sm:text-xl'>AdityaRealEstate</h2>
        <div>
            <input type="text" placeholder="Search" className='border-2 rounded-md border-slate-200 w-32 md:w-auto'/>
        </div>
        <div className='flex justify-start gap-2'>
           <Link to="/" className="font-serif font-medium text-slate-700 text-lg cursor-pointer hidden md:block">Home</Link>
           <Link to="/about" className='font-serif font-medium text-slate-700 text-lg cursor-pointer hidden md:block'>About</Link>
           <Link to="/profile">
           {currentUser ? (
              <img src={currentUser.avatar} alt="profile" className='w-10 rounded-2xl'></img>
           ): <span className='font-serif font-medium text-slate-700 text-sm sm:text-lg cursor-pointer'>SignIn</span>}
           </Link>
        </div>
    </div>
  )
}

export default Header