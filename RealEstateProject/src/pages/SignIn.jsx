import React, { useState } from 'react';
import signUpImg from "../assets/signUpImg.webp";
import { Link,useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

const SignIn = () => {
  
  const [formData,setFormData] = useState({});
  const {loading,error} = useSelector ((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin',{
        method: 'POST',
        credentials: 'include',
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
          dispatch(signInFailure(data.message));
          return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    }
    catch(error){
        dispatch(signInFailure(error.message));
    }

  };

  return ( 
    <div>
      <div className='flex justify-center align-center w-full h-auto mt-24'>
        <div className='hidden md:flex'>
          <img src={signUpImg} className='border-25 rounded-lg'/>
        </div>
        <form className='flex-col flex justify-center align-center text-center mx-24 gap-6 font-serif font-normal text-base' onSubmit={handleSubmit}>
          <h1 className='font-semibold text-4xl'>Sign In</h1>
          <input placeholder='E-mail' type="email" id='email' onChange={handleChange}></input>
          <input placeholder='Password' type="password" id='password' onChange={handleChange}></input>
          <button disabled={loading} className='border-2 rounded-sm bg-orange-500 border-amber-600'>{loading ? 'loading...' : 'Sign In'}</button>
          <OAuth />
          <span>Dont Have an account?
            <Link to='/sign-up' className='text-cyan-400'> Sign Up</Link>.
          </span>
          {error && <p className='text-rose-600'>{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default SignIn