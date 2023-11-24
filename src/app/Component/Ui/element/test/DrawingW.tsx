"use client"
import { useCallback, useRef, useState } from "react";
import { DrawingMode, ShapeType } from "../typse";
import Toolbox from "./Toolbox";
import DrawingCanvas from "./DrawingCanvas";


export default function DrawingW() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mode, setMode] = useState<DrawingMode>(DrawingMode.FreeDraw);
  const [color, setColor] = useState<string>(getDefaultBrushColor());
  const [size, setSize] = useState<number>(5);
  const [style, setStyle] = useState<CanvasLineCap>('round');
  const [text, setText] = useState<string>('');
  const [textSize, setTextSize] = useState<number>(16);
  const [textColor, setTextColor] = useState<string>(getDefaultBrushColor());
  const [textFont, setTextFont] = useState<string>('Arial');
  const [shape, setShape] = useState<ShapeType>(ShapeType.Rectangle);
 
  function getDefaultBrushColor() {
    //theme color
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'white'; 
    } else {
        return 'black'; 
    }
}

const handleShapeChange = useCallback((newShape: ShapeType) => {

    setShape(newShape);
  console.log(shape);
  console.log(newShape);
  
    
  }, []);

  const handleModeChange = useCallback((newMode: DrawingMode) => {
    setMode(newMode);
  }, []);

  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor);
  }, []);

  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
  }, []);

  const handleStyleChange = useCallback((newStyle: CanvasLineCap) => {
    setStyle(newStyle);
  }, []);
  const handletextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);
  const handletextSizeChange = useCallback((newTextSize: number) => {
    setTextSize(newTextSize);
  }, []);
  const handletextColorChange = useCallback((newTextColor: string) => {
    setTextColor(newTextColor);
  }, []);
  const handletextFontChange = useCallback((newTextFont: string) => {
    setTextFont(newTextFont);
  }, []);
 


  return (<>
  <div  >
    <div className=" gap-5  flex flex-col ">
    <div>
    <Toolbox 
      mode={mode}
      shape={shape}
      color={color}
      size={size}
      style={style}
      text={text}
      textSize={textSize}
      textColor={textColor}
      textFont={textFont}

      onModeChange={handleModeChange}
      onColorChange={handleColorChange}
      onSizeChange={handleSizeChange}
      onStyleChange={handleStyleChange}
      onhandleTextChange={handletextChange}
      onhandleTextSizeChange={handletextSizeChange}
      onhandleTextColorChange={handletextColorChange}
      onhandleTextFontChange={handletextFontChange}
      onShapeChange={handleShapeChange}

    />
    </div>
    <div className=" w-screen " >
  <DrawingCanvas
      mode={mode}
      color={color}
      size={size}
      style={style}
      text={text}
      textSize={textSize}
      textColor={textColor}
      textFont={textFont}
      Shape={shape}

    />
    </div>
    
   </div>
    </div>
    
  </>


  )


}