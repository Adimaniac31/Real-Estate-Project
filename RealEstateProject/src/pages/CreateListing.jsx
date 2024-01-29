import React from 'react'
import Header from '../components/Header'

const CreateListing = () => {
    return (
        <div>
            <Header />
            <div className='flex flex-col justify-center items-center p-3 mx-auto'>
                <h1 className='text-3xl font-semibold my-7 font-serif'>Create Listing</h1>
                <div className='flex flex-col gap-4'>
                    <form className='flex flex-col sm:flex-row gap-4 w-fit'>
                        <input type="text" placeholder='Name' className='border p-3 rounded-lg outline-dashed outline-amber-400' id='name' maxLength='62' minLength='10' required></input>
                        <textarea type="text" placeholder='Description' className='border p-3 rounded-lg outline-dashed outline-amber-400' id='description' required></textarea>
                        <input type="text" placeholder='Address' className='border p-3 rounded-lg outline-dashed outline-amber-400' id='address' required></input>
                    </form>
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5'></input>
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-5'></input>
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-5'></input>
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-5'></input>
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5'></input>
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='flex gap-2 items-center'>
                            <input type='number' id='bedrooms' min='1' max='10' required className='p-3 outline-dashed outline-2 outline-amber-400 rounded-md w-12' />
                            <p className='h-max'>Bedrooms</p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input type='number' id='bathrooms' min='1' max='10' required className='p-3 outline-dashed outline-2 outline-amber-400 rounded-md w-12' />
                            <p className='h-max'>Bathrooms</p>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='flex gap-2 items-center'>
                            <input type='number' id='regularPrice' required className='p-3 outline-dashed outline-2 outline-amber-400 rounded-md w-fit' />
                            <p className='h-max'>Regular Price(in rupees)</p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input type='number' id='discountPrice' required className='p-3 outline-dashed outline-2 outline-amber-400 rounded-md w-fit min-w-16' />
                            <p className='h-max'>Discount Price(in rupees)</p>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='flex flex-col flex-1 gap-4'>
                            <p className='font-semibold'>
                                Images:
                                <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                            </p>
                            <div className='flex space-x-4'>
                                <input type="file" id="images" accept="image/*" multiple className='p-3 border w-fit outline-dashed outline-2 outline-amber-400 rounded-md'></input>
                                <button className='p-3 text-green-700 rounded border border-green-700 hover:border-white hover:text-white hover:bg-green-700'>Upload</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateListing