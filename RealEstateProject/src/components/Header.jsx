import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link,useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
const Header = () => {
  const { currentUser } = useSelector(state => state.user)
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleChange = async (e) => {
    setSearchTerm(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm',searchTerm);
    const searchQuery = urlParams.toString();
    navigate("/search?"+searchQuery);
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  },[location.search]);

  return (
    <div className='flex justify-between p-4 bg-amber-400'>
      <h2 className='flex font-serif font-bold text-slate-700 text-sm sm:text-xl'>AdityaRealEstate</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Search" onChange={handleChange} value={searchTerm} className='border-2 rounded-md border-slate-200 w-32 md:w-auto' />
          <button className='mx-2'>
            <FaSearch className='text-slate-600'></FaSearch>
          </button>
        </form>
      </div>
      <div className='flex justify-start gap-2'>
        <Link to="/" className="font-serif font-medium text-slate-700 text-lg cursor-pointer hidden md:block">Home</Link>
        <Link to="/about" className='font-serif font-medium text-slate-700 text-lg cursor-pointer hidden md:block'>About</Link>
        <Link to="/profile">
          {currentUser ? (
            <img src={currentUser.avatar} alt="profile" className='w-10 rounded-2xl'></img>
          ) : <span className='font-serif font-medium text-slate-700 text-sm sm:text-lg cursor-pointer'>SignIn</span>}
        </Link>
      </div>
    </div>
  )
}

export default Header