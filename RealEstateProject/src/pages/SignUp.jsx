import React, { useState } from 'react'
import signUpImg from "../assets/signUpImg.webp"
import { Link,useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
const SignUp = () => {
  
  const [formData,setFormData] = useState({});
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      });
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const res = await fetch('/api/auth/signup',{
        method: 'POST',
        credentials: 'include',
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
          setLoading(false);
          setError(data.message);
          return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    }
    catch(error){
        setLoading(false);
        setError(error.message);
    }

  };

  return ( 
    <div>
      <div className='flex justify-center align-center w-full h-auto mt-24'>
        <div className='hidden md:flex'>
          <img src={signUpImg} className='border-25 rounded-lg'/>
        </div>
        <form className='flex-col flex justify-center align-center text-center mx-24 gap-6 font-serif font-normal text-base' onSubmit={handleSubmit}>
          <h1 className='font-semibold text-4xl'>Sign Up</h1>
          <input placeholder='Username' type="text" id='username' onChange={handleChange}></input>
          <input placeholder='E-mail' type="email" id='email' onChange={handleChange}></input>
          <input placeholder='Password' type="password" id='password' onChange={handleChange}></input>
          <button disabled={loading} className='border-2 rounded-sm bg-orange-500 border-amber-600'>{loading ? 'loading...' : 'Sign Up'}</button>
          <OAuth />
          <span>Have an account?
            <Link to='/sign-in' className='text-cyan-400'> Sign In</Link>.
          </span>
          {error && <p className='text-rose-600'>{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default SignUp