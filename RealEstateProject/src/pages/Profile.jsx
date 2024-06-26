import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { updateUserFailure, updateUserSuccess, updateUserStart, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess } from "../redux/user/userSlice"

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector(state => state.user)
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSucess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSucess(true);
    }
    catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleShowListing = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div>
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
        <form className='flex-col flex justify-center align-center text-center md:mx-24 mx-2 gap-6 font-serif font-normal text-base md:w-96' onSubmit={handleSubmit}>
          <h1 className='font-semibold text-4xl'>Profile</h1>
          <input placeholder="username" defaultValue={currentUser.username} type="text" id='username' onChange={handleChange}></input>
          <input placeholder="email" defaultValue={currentUser.email} type="email" id='email' onChange={handleChange}></input>
          <input placeholder="password" type="password" id='password' onChange={handleChange}></input>
          <button className='border-2 rounded-sm bg-orange-400 border-amber-500'>{loading ? 'Loading' : 'Update'}</button>
          <Link to="/create-listing" className='border-2 rounded-sm bg-orange-400 border-amber-500'>Create Listing</Link>
          <button className='border-2 rounded-sm bg-orange-400 border-amber-500' onClick={handleShowListing}>Show Listing</button>
          <p className='text-red-700'>{showListingError ? 'Error showing Listings' : ''}</p>
          {userListings && userListings.length > 0 &&
            <div className='flex flex-col gap-4'>
              <h1 className='text-center mt-2 text-2xl font-semibold'>Your Listings</h1>
              {userListings.map((listing) => (
                <div key={listing._id} className='border rounded-lg p-3 flex md:justify-between justify-center item-center gap-4 md:flex-row flex-col'>
                  <Link to={`/listing/${listing._id}`}>
                    <img src={listing.imageUrls[0]} alt="listing cover" className='h-16 w-16 rounded-lg'></img>
                  </Link>
                  <Link className='flex' to={`/listing/${listing._id}`}>
                    <p className='text-black font-semibold hover:underline truncate'>{listing.name}</p>
                  </Link>
                  <div className='gap-4 flex items-center md:flex-col'>
                    <button className='text-red-600 uppercase' onClick={() => handleListingDelete(listing._id)}>Delete</button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-green-600 uppercase'>Edit</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>}
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