import { React, useEffect, useState } from 'react'
import { getStorage, getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';
import { app } from "../firebase";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateListing = () => {
    const {currentUser} = useSelector(state =>state.user);
    const navigate = useNavigate();
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking:  false,
        furnished: false
    });
    const [uploading,setUploading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [error,setError] = useState(false);
    const [loading,setLoading] = useState(false);
    
    useEffect(()=>{
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            setFormData(data);
            if(data.success === false){
                return;
            }
        }
        fetchListing();
    },[]);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length +formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData, imageUrls: formData.imageUrls.concat(urls),
                });
                setImageUploadError(false);
                setUploading(false);
            }).catch((err) => {
                setImageUploadError('Image Upload failed (2 MB image max per image)');
                setUploading(false);
            });
        }else{
           setImageUploadError("You can only upload 6 images per listing"); 
           setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
            );
        })
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_,i) => i!== index),
        });
    };

    const handleChange = (e) => {
        if(e.target.id === "sale" ||  e.target.id === "rent"){
            setFormData({
                ...formData,
                type: e.target.id
            });
        }
        else if(e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer"){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }
        else{
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            });
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if(formData.imageUrls.length<1) return setError("You have to add atleast one image.");
            if(+formData.regularPrice < +formData.discountPrice) return setError("Discount price must be lower than regular price.");
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`,{
                method:'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            });
            const data =  await res.json();
            setLoading(false);
            if(data.success === false){
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);
        }
        catch(error){
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='flex flex-col justify-center items-center p-3 mx-auto'>
                <h1 className='text-3xl font-semibold my-7 font-serif'>Update Listing</h1>
                <div className='flex flex-col gap-4 ml-1'>
                    <form className='flex flex-col sm:flex-row gap-4 w-fit'>
                        <input type="text" placeholder='Name' className='border p-3 rounded-lg outline-dashed outline-amber-400' id='name' maxLength='62' minLength='10' required onChange={handleChange} value={formData.name}></input>
                        <textarea type="text" placeholder='Description' className='border p-3 rounded-lg outline-dashed outline-amber-400' id='description' required onChange={handleChange} value={formData.description}></textarea>
                        <input type="text" placeholder='Address' className='border p-3 rounded-lg outline-dashed outline-amber-400' id='address' required onChange={handleChange} value={formData.address}></input>
                    </form>
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={formData.type === 'sale'}></input>
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={formData.type === 'rent'}></input>
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-5' onChange={handleChange} checked={formData.parking}></input>
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished}></input>
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={formData.offer}></input>
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='flex gap-2 items-center'>
                            <input type='number' id='bedrooms' min='1' max='10' required className='p-3 outline-dashed outline-2 outline-amber-400 rounded-md w-12' onChange={handleChange} value={formData.bedrooms}/>
                            <p className='h-max'>Bedrooms</p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input type='number' id='bathrooms' min='1' max='10' required className='p-3 outline-dashed outline-2 outline-amber-400 rounded-md w-12' onChange={handleChange} value={formData.bathrooms}/>
                            <p className='h-max'>Bathrooms</p>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='flex gap-2 items-center'>
                            <input type='number' id='regularPrice' required className='p-3 outline-dashed outline-2 outline-amber-400 rounded-md w-fit' onChange={handleChange} value={formData.regularPrice} min='50' max='99999999999'/>
                            <p className='h-max'>Regular Price(in rupees)</p>
                        </div>
                        {
                            formData.offer && ( 
                            <div className='flex gap-2 items-center'>
                                <input type='number' id='discountPrice' required className='p-3 outline-dashed outline-2 outline-amber-400 rounded-md w-fit min-w-16' onChange={handleChange} value={formData.discountPrice} min='0' max='99999999999'/>
                                <p className='h-max'>Discount Price(in rupees)</p>
                            </div>
                            )
                        }
                        
                    </div>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='flex flex-col flex-1 gap-4'>
                            <p className='font-semibold'>
                                Images:
                                <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                            </p>
                            <div className='flex space-x-2'>
                                <input onChange={(e) => { setFiles(e.target.files) }} type="file" id="images" accept="image/*" multiple className='p-3 border w-fit outline-dashed outline-2 outline-amber-400 rounded-md'></input>
                            </div>
                            <button onClick={handleImageSubmit} className='p-3 text-green-700 rounded border border-green-700 hover:border-white hover:text-white hover:bg-green-700' disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
                            <p className='text-rose-700 text-sm'>{imageUploadError && imageUploadError}</p>
                            {
                                formData.imageUrls.length > 0 && formData.imageUrls.map((url,index) => (
                                    <div key={url} className='flex justify-between p-3 prder items-center'>
                                        <img src={url} alt='listing-image' className='w-40 h-40 object-contain rounded-lg'></img>
                                        <button type="button" onClick={()=>handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase border border-red-700 hover:border-white hover:text-white hover:bg-red-700'>Delete</button>
                                    </div>
                                ))
                            }
                            <button disabled={loading || uploading} onClick={handleSubmit} className='p-3 text-green-700 rounded border border-green-700 hover:border-white hover:text-white hover:bg-green-700'>
                            {loading? "Updating" : "Update Listing"}
                            </button>
                            {error && <p className='text-red-700 text-sm'>{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateListing