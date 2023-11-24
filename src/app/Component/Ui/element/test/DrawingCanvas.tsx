import React, { MouseEventHandler, use, useCallback, useEffect, useRef, useState } from "react";
import { DrawingMode, ShapeType } from "../typse";
import SetHistory from "../SetHistory";
import ImageUpload from "./ImageUploaad";
import { Input } from "@/components/ui/input";

/**
 * @abstract : DrawingCanvas
 * @param mode : DrawingMode
 * @param color : string
 */

interface DrawingCanvasProps {

  mode: DrawingMode;
  Shape: ShapeType;
  color: string;
  size: number;
  style: CanvasLineCap;
  text: string;
  textSize: number;
  textColor: string;
  textFont: string;

}

export default function DrawingCanvas({ mode, Shape, color, size, style, text, textSize, textColor, textFont }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [textvalue, setText] = useState('');
const [isScaled, setIsScaled] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);



  useEffect(() => {

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio ;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    console.log(dpr, rect.width, rect.height, canvas.width, canvas.height);
    
saveCanvasState();
if  (isScaled){
     ctx.scale(dpr, dpr);
}
setIsScaled(false);

  }, []);

  const scaleCanvas = useCallback(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }, []);

  // Call the scaleCanvas function in the useEffect hook
  useEffect(() => {
    scaleCanvas();
    saveCanvasState()
  }, [scaleCanvas]);

  

  const saveCanvasState = useCallback(() => {
    const canvas = canvasRef.current!;
    

    const imageData = canvas.toDataURL();
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  }, [canvasRef, history, currentHistoryIndex]);


  const getMousePos = (e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return {
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top || 0)

    };
  }


  const drawFree = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = style;
    //@ts-ignore
    ctx.lineJoin = style;


    ctx.lineTo(x, y);
    ctx.stroke();
  }, [color, size, style]);

  const erase = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.clearRect(x - 5, y - 5, -size / 2, size / 2);

    ctx.lineWidth = size;
    ctx.lineCap = style;

  }, [size, style]);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    console.log("down");
    setIsDrawing(true);

    const pos = getMousePos(event);
    setStartPos(pos);
    const ctx = canvasRef.current?.getContext('2d');

    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);

      if (mode === DrawingMode.FreeDraw) {
        drawFree(ctx, pos.x, pos.y);
      } else if (mode === DrawingMode.Erase) {
        erase(ctx, pos.x, pos.y);
      } else if (mode === DrawingMode.Text) {
        const inputText = text;
        if (inputText) {
          ctx.font = `${textSize}px ${textFont}`;
          ctx.lineWidth = textSize / 10;
          ctx.fillStyle = textColor;
          ctx.fillText(inputText, pos.x, pos.y);
          setText(inputText);
        }
      }
      // Selection mode does not require immediate action on mouse down
    }
  }, [mode, drawFree, erase, text, textColor, textFont, textSize]);



  const handleMouseMove = useCallback((event: MouseEvent) => {

    if (!isDrawing) return;

    const pos = getMousePos(event);
    const ctx = canvasRef.current?.getContext('2d');

    if (ctx && (mode === DrawingMode.FreeDraw || mode === DrawingMode.Erase)) {
      if (mode === DrawingMode.FreeDraw) {
        drawFree(ctx, pos.x, pos.y);
      } else {
        erase(ctx, pos.x, pos.y);
      }
    }
    // No drawing action for Text and Select modes on mouse move
  }, [isDrawing, mode, drawFree, erase]);

  const setDrawingForm = useCallback(() => {
    console.log("setShape", Shape);
    const canvas: HTMLCanvasElement = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = style;
    //@ts-ignore
    ctx.lineJoin = style;
    //@ts-ignore
    const pos = getMousePos(event);

    if (Shape === ShapeType.Rectangle) {
      ctx.beginPath();

      ctx.strokeRect(startPos!.x, startPos!.y, pos.x - startPos!.x, pos.y - startPos!.y)
    } else if (Shape === ShapeType.Circle) {
      ctx.beginPath();
      ctx.arc(startPos!.x, startPos!.y, Math.abs(pos.x - startPos!.x), 0, 2 * Math.PI);
      ctx.stroke();
    } else if (Shape === ShapeType.Line) {
      ctx.beginPath();
      ctx.moveTo(startPos!.x, startPos!.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (Shape === ShapeType.Triangle) {
      ctx.beginPath();
      ctx.moveTo(startPos!.x, startPos!.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.lineTo(startPos!.x, pos.y);
      ctx.closePath();
      ctx.stroke();
    } else if (Shape === ShapeType.Arrow) {
      ctx.beginPath();
      ctx.moveTo(startPos!.x, startPos!.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x - 10, pos.y - 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x - 10, pos.y + 10);
      ctx.stroke();
    } else if (Shape === ShapeType.Diamond) {
      ctx.beginPath();
      ctx.moveTo(startPos!.x, startPos!.y);
      ctx.lineTo(startPos!.x - 10, startPos!.y + 10);
      ctx.lineTo(startPos!.x, startPos!.y + 20);
      ctx.lineTo(startPos!.x + 10, startPos!.y + 10);
      ctx.closePath();
      ctx.stroke();
    } else if (Shape === ShapeType.Pentagon) {
      ctx.beginPath();
      ctx.moveTo(startPos!.x, startPos!.y);
      ctx.lineTo(startPos!.x - 10, startPos!.y + 10);
      ctx.lineTo(startPos!.x - 5, startPos!.y + 20);
      ctx.lineTo(startPos!.x + 5, startPos!.y + 20);
      ctx.lineTo(startPos!.x + 10, startPos!.y + 10);
      ctx.closePath();
      ctx.stroke();
    } else if (Shape === ShapeType.Hexagon) {
      ctx.beginPath();
      ctx.moveTo(startPos!.x, startPos!.y);
      ctx.lineTo(startPos!.x - 10, startPos!.y + 10);
      ctx.lineTo(startPos!.x - 10, startPos!.y + 20);
      ctx.lineTo(startPos!.x, startPos!.y + 30);
      ctx.lineTo(startPos!.x + 10, startPos!.y + 20);
      ctx.lineTo(startPos!.x + 10, startPos!.y + 10);
      ctx.closePath();
      ctx.stroke();
    } else if (Shape === ShapeType.Octagon) {
      ctx.beginPath();
      ctx.moveTo(startPos!.x, startPos!.y);
      ctx.lineTo(startPos!.x - 5, startPos!.y + 10);
      ctx.lineTo(startPos!.x - 10, startPos!.y + 20);
      ctx.lineTo(startPos!.x - 5, startPos!.y + 30);
      ctx.lineTo(startPos!.x + 5, startPos!.y + 30);
      ctx.lineTo(startPos!.x + 10, startPos!.y + 20);
      ctx.lineTo(startPos!.x + 5, startPos!.y + 10);
      ctx.closePath();
      ctx.stroke();
    }

    



  }, [color, size, style, startPos, Shape]);


  const handleMouseUp = useCallback(() => {

    setIsDrawing(false);
    const canvas: HTMLCanvasElement = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = style;
    //@ts-ignore
    ctx.lineJoin = style;

    if (mode === DrawingMode.Select && startPos) {
      let newShape = Shape;
      setDrawingForm()
    }
    ctx.closePath();
    setStartPos(null);
    saveCanvasState();
  }, [mode, startPos, saveCanvasState, color, size, style, setDrawingForm, Shape]);


  useEffect(() => {

    const canvasli = canvasRef.current!;
    if (canvasli) {
      canvasli.addEventListener('mousedown', handleMouseDown);

      canvasli.addEventListener('mousemove', handleMouseMove);

      canvasli.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      canvasli.removeEventListener('mousedown', handleMouseDown);

      canvasli.removeEventListener('mousemove', handleMouseMove);

      canvasli.removeEventListener('mouseup', handleMouseUp);

    }



  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <>






      <div className=" flex flex-col gap-2   p-2  w-screen h-screen " >
        <div className="inline-flex justify-between items-center border border-border rounded-sm p-2   "   >


          <ImageUpload canvasRef={canvasRef} />

          <SetHistory canvasRef={canvasRef} history={history} currentHistoryIndex={currentHistoryIndex} setCurrentHistoryIndex={setCurrentHistoryIndex} />
        </div>
        <canvas ref={canvasRef} className=" border-border sm:h-[60%] h-[50%]  rounded-sm border-2 " />



      </div>
    </>
  )
}

