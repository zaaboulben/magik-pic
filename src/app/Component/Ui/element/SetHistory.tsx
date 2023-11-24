import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";


interface UndoRedoProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
        history: string[];
        currentHistoryIndex: number;
        setCurrentHistoryIndex: React.Dispatch<React.SetStateAction<number>>;


}

export default function SetHistory({ canvasRef,history,currentHistoryIndex,setCurrentHistoryIndex }: UndoRedoProps) {
    // const [history, setHistory] = useState<string[]>([]);
    // const[currentHistoryIndex,setCurrentHistoryIndex]=useState<number>(-1);

    // const saveCanvasState = useCallback(() => {
    //         console.log("save");

    //         const canvas= canvasRef.current!;
    //         const imageData=canvas.toDataURL();
    //         const newHistory=history.slice(0,currentHistoryIndex+1);
    //         newHistory.push(imageData);
    //         setHistory(newHistory);
    //         setCurrentHistoryIndex(newHistory.length-1);
    //         console.log(newHistory);
    // }, [canvasRef,history,currentHistoryIndex]);

    const undo = useCallback(() => {
            console.log("undo");
            
            if(currentHistoryIndex<=0)return;

            setCurrentHistoryIndex(currentHistoryIndex-1);
            const ImageData=history[currentHistoryIndex-1];
            const canvas=canvasRef.current!;
            const ctx=canvas.getContext("2d")!;

            const image=new Image();
            image.onload=()=>{
                ctx.clearRect(0,0,canvas.width,canvas.height);
                ctx.drawImage(image,0,0);
            
            };
            image.src=ImageData;
            console.log(history);
            console.log(canvas.width,canvas.height,canvas.style.width,canvas.style.height);
            
    
    }, [history,currentHistoryIndex,canvasRef,setCurrentHistoryIndex]);

    const redo=useCallback(()=>{
        console.log("redo");
        if(currentHistoryIndex>=history.length-1)return;
        setCurrentHistoryIndex(currentHistoryIndex+1);
        const ImageData=history[currentHistoryIndex+1];
        const canvas=canvasRef.current!;
        const ctx=canvas.getContext("2d")!;
        const image=new Image();
        image.onload=()=>{
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(image,0,0);
        
        };
        image.src=ImageData;
        console.log(history);    
        
    },[history,currentHistoryIndex,canvasRef,setCurrentHistoryIndex]);




return (
        <>
       
            <div className="gap-2 inline-flex   " >
                <Button onClick={undo}>undo</Button>
                <Button onClick={redo}>redo</Button>

            </div>
        </>
    
    )
}