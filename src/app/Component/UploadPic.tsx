'use client'
import Image from 'next/image';
import React, { useEffect } from 'react';
import { set } from 'zod';
import CanvasDraw from './CanvasDraw';

export default function UploadPic() { 



 const [image, setImage] = React.useState(null);
    const [url, setUrl] = React.useState("");
    const [progress, setProgress] = React.useState(0);
    const [loaded, setLoaded] = React.useState(false);

    const handleChange = e => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setUrl(URL.createObjectURL(e.target.files[0]));
            localStorage.setItem('image', URL.createObjectURL(e.target.files[0]))

            setLoaded(true);

        }
    };


return(

<>
    {!loaded &&
    <div >
<div>
    text

    </div>

    <input type="file" onChange={handleChange} />

<a href={url} download={true}> lol</a>
    <button>Upload</button>
    </div>
    }{loaded &&
<CanvasDraw url={url}/>
}

</>

    
    )

}