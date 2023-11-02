import React, { useRef, useEffect, useState, useCallback } from 'react';
import { set } from 'zod';

interface Point {
    x: number;
    y: number;
  }
  
  interface Path {
    color: string;
    lineWidth: number;
    lineCap: CanvasLineCap;
    points: Point[];
  }

export default function CanvasDraw() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>('#000000');
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [lineStyle, setLineStyle] = useState<CanvasLineCap>('round');
  const [paths, setPaths] = useState<Path[]>([]);
  const [isEraser, setIsEraser] = useState<boolean>(false);
    const [imagestate, setImage] = React.useState(null);
    // Function to redraw all paths
    const redrawPaths = useCallback(() => {
        const ctx = contextRef.current;
        if (ctx) {
            paths.forEach((path) => {
                ctx.beginPath();
                ctx.strokeStyle = path.color;
                ctx.lineWidth = path.lineWidth;
                ctx.lineCap = path.lineCap;
                for (let i = 0; i < path.points.length - 1; i++) {
                    ctx.moveTo(path.points[i].x, path.points[i].y);
                    ctx.lineTo(path.points[i + 1].x, path.points[i + 1].y);
                    ctx.stroke();
                }
            });
        }
    }, [paths]);

    // Function to handle drawing or erasing
    const handleDrawing = (x, y) => {
        if (!isDrawing) return;

        const ctx = contextRef.current;
        if (ctx) {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    useEffect(() => {
        console.log('reloaded'+1);
        
        const canvas = canvasRef.current;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.width = 1200; // Set width double for high DPI screens
            canvas.height = 1200; // Set height double for high DPI screens
            ctx.scale(2, 2); // Adjust the scaling for high DPI screens
            ctx.lineCap = lineStyle;
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            contextRef.current = ctx;

            // Load the image and draw it
            const storedImage = localStorage.getItem('image');
            if (storedImage) {
                setImage(storedImage);
                const img = new Image();
                img.src = storedImage;
                img.onload = function () {
                    ctx.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
                    redrawPaths(); // Redraw paths after the image is loaded
                };
                // img.onload = function () {
                //     ctx.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
                //     redrawPaths(); // Redraw paths after the image is loaded
                // };
            }
        }
    }, [color, lineWidth, lineStyle, redrawPaths]);

    const startDrawing = ({ nativeEvent }:any) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        // Add the initial point to the current path
        setPaths((prevPaths) => [
            ...prevPaths,
            { color: color, lineWidth: lineWidth, lineCap: lineStyle, points: [{ x: offsetX, y: offsetY }] },
        ]);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }:any) => {
        const { offsetX, offsetY } = nativeEvent;
        handleDrawing(offsetX, offsetY);
        // Add new point to the current path
        if (isDrawing) {
            setPaths((prevPaths) => {
                const newPaths = [...prevPaths];
                newPaths[newPaths.length - 1].points.push({ x: offsetX, y: offsetY });
                return newPaths;
            });
        }
    };

    // Function to clear the canvas
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            localStorage.removeItem('image');
            setPaths([]);
            const image = new Image();
            image.src = imagestate;
            image.onload = function () {
                ctx.drawImage(image, 0, 0, canvas.width / 2, canvas.height / 2);
                redrawPaths(); // Redraw paths after the image is loaded
            };
      
            }
    }







    // Handlers to change stroke style
    const handleColorChange = (e:any) => setColor(e.target.value);
    const handleLineWidthChange = (e:any) => setLineWidth(e.target.value);
    const handleLineStyleChange = (e:any) => setLineStyle(e.target.value);
    const toggleEraser = () => {setIsEraser(!isEraser) ,setColor('#ffffff')};

    return (
        <>
            <canvas
                id="canvas"
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onMouseOut={finishDrawing}
                ref={canvasRef}
                className="w-[600px] h-[600px] border-2 border-black"
            />
            <div>
                <label htmlFor="strokeColor">Stroke Color:</label>
                <input
                    type="color"
                    id="strokeColor"
                    value={color}
                    onChange={handleColorChange}
                    disabled={isEraser}
                />
                <label htmlFor="lineWidth">Line Width:</label>
                <input
                    type="range"
                    id="lineWidth"
                    min="1"
                    max="50"
                    value={lineWidth}
                    onChange={handleLineWidthChange}
                />
                <label htmlFor="lineStyle">Line Style:</label>
                <select id="lineStyle" value={lineStyle} onChange={handleLineStyleChange}>
                    <option value="round">Round</option>
                    <option value="square">Square</option>
                    <option value="butt">Butt</option>
                </select>
                <button onClick={toggleEraser}>{isEraser ? 'Disable' : 'Enable'} Eraser</button>
                <button onClick={clearCanvas}>Clear Canvas</button>
            </div>
        </>
    );
}
