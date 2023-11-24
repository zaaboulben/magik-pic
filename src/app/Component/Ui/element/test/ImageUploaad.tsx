


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useCallback, useState } from "react";

interface UndoRedoProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
          
}

export default function ImageUpload({ canvasRef }: UndoRedoProps) {
const [isImage, setIsImage] = useState(false);


    const handleimageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const canvas= canvasRef.current!;
        const ctx=canvas.getContext("2d")!;
        const dpr=window.devicePixelRatio||1;
        const rect=canvas.getBoundingClientRect();
        canvas.width=rect.width*dpr;
        canvas.height=rect.height*dpr;
        ctx.scale(dpr,dpr);
        
        const imag = new Image();
        imag.src = localStorage.getItem("image saved")!;
        imag.onload = function () {
          const canvas: HTMLCanvasElement = canvasRef.current!;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(imag, 0, 0, canvas.width, canvas.height);
        }
       
      
        setIsImage(true);
          
    }
    const downloadImage = useCallback(() => {
        const canvas = canvasRef.current!;
        const image = canvas.toDataURL();
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = image;
        link.click();
        }, [canvasRef]);

      
    

        return(
            <div className='w-screen' >
            <div className='inline-flex justify-between gap-4  text-muted-foreground'  > 
                
                <Input className=" text-muted-foreground" placeholder='te' type="file" onChange={handleimageUpload}/>
                   
              
                <Button className='' onClick={downloadImage}>download</Button> 
            </div>
            </div>
            )

}