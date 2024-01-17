import React from 'react'
import Header from '../components/Header'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import {updateUserFailure,updateUserSuccess,updateUserStart, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess} from "../redux/user/userSlice"

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser,loading,error } = useSelector(state => state.user)
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess,setUpdateSucess] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  }

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL });
          }
          )
      });
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res = await fetch(`api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSucess(true);
    }
    catch(error){
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try{ 
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:"DELETE",
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    }catch(error){
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () =>{
    try{
      dispatch(signOutUserStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    }catch(error){
      dispatch(signOutUserFailure(error.message));
    }
  }

  return (
    <div>
      <Header />
      <div className='flex justify-center align-center w-full h-auto mt-24 md:flex-row flex-col'>
        <div className='flex justify-center align-center p-8 flex-col'>
          <input type='file' ref={fileRef} hidden accept='image/.*' onChange={(e) => setFile(e.target.files[0])}></input>
          <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} className='border-25 rounded-full md:w-64 w-auto' />
          <p className='flex justify-center gap-5 mb-1 mt-4'>
          {fileUploadError ?
            <span className='text-rose-600'>Error image upload!</span>
            : filePerc > 0 && filePerc < 100 ? (
              <span className='text-green-700'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-900'>Image Successfully Uploaded!</span>
            ) : (
              ""
            )
          }
        </p>
        </div>
        <form className='flex-col flex justify-center align-center text-center mx-24 gap-6 font-serif font-normal text-base md:w-64' onSubmit={handleSubmit}>
          <h1 className='font-semibold text-4xl'>Profile</h1>
          <input placeholder="username" defaultValue={currentUser.username} type="text" id='username' onChange={handleChange}></input>
          <input placeholder="email" defaultValue={currentUser.email} type="email" id='email' onChange={handleChange}></input>
          <input placeholder="password" type="password" id='password' onChange={handleChange}></input>
          <button className='border-2 rounded-sm bg-orange-500 border-amber-600'>{loading?'Loading':'Update'}</button>
          <button className=' border-2 rounded-sm border-amber-600 text-rose-600' onClick={handleDeleteUser}>
            Delete Account!!
          </button>
          <span onClick={handleSignOut} className='cursor-pointer'>
            Sign Out
          </span>
          <p className='text-rose-500'>
            {error ? error : ''}
          </p>
          <p className='text-green-500'>
            {updateSuccess ? 'user is updated successfully' : ''}
          </p>
        </form>
      </div>
    </div>
  )
}

export default Profile