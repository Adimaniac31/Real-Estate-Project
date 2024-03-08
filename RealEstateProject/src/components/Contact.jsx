import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
const Contact = ({ listing }) => {
    const [landlord, setlandlord] = useState(null);
    const [message, setMessage] = useState('');
    useEffect(() => {
        const fetchLandLord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setlandlord(data);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchLandLord();
    }, [listing.useRef]);

    const onChange = (e) => {
        setMessage(e.target.value);
    }
    return (
        <>
            {landlord && (
                <div className='flex flex-col gap-2'>
                    <p>
                        Contact
                        <span className='font-semibold'>
                            {" " + landlord.username + " "}
                        </span>
                        for
                        <span className='font-semibold'>
                            {" " + listing.name.toLowerCase() + " "}
                        </span></p>
                    <textarea
                        name="message"
                        id="message"
                        cols="30"
                        rows="2"
                        value={message}
                        onChange={onChange}
                        placeholder="Enter your message here!!"
                        className='w-full border p-3 rounded-lg'
                    >
                    </textarea>
                    <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className="bg-amber-400 text-white text-center p-3 uppercase rounded-lg hover:opacity-95">
                        Send Message
                    </Link>
                </div>
            )}
        </>
    )
}

export default Contact