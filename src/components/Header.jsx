import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-between p-4 bg-amber-400'>
        <h2 className='flex font-serif font-bold text-slate-700 text-xl'>AdityaRealEstate</h2>
        <div>
            <input type="text" placeholder="Search" className='border-2 rounded-md border-slate-200'/>
        </div>
        <div className='flex justify-start gap-2'>
           <h4 className="font-serif font-medium text-slate-700 text-lg cursor-pointer hidden md:block">Home</h4>
           <h4 className='font-serif font-medium text-slate-700 text-lg cursor-pointer hidden md:block'>About</h4>
           <h4 className='font-serif font-medium text-slate-700 text-lg cursor-pointer'>SignIn</h4> 
        </div>
    </div>
  )
}

export default Header