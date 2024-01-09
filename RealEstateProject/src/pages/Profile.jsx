import React from 'react'
import Header from '../components/Header'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector(state => state.user)
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(formData);
  console.log(filePerc);
  console.log(fileUploadError);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

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