import React from 'react'
import googleLogo from "../assets/google.png"
import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async ()=>{
      try{
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth,provider);
            const res = await fetch('/api/auth/google',{
              method:'POST',
              credentials: 'include',
              headers:{
                'Content-Type':'application/json',
              },
              body:JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL}),
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
      }catch(error){
        console.log("Could not signin with google",error);
      }
  };
  return (
    <button onClick={handleGoogleClick} className='flex justify-center border-2 rounded-sm bg-white border-amber-600'>
      <h4>Or continue using</h4>
      <img src={googleLogo} className='w-7 '></img>
    </button>
  )
}

export default OAuth