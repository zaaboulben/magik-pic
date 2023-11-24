import { useCallback } from "react";
import { DrawingMode, ShapeType } from "../typse";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ToolboxProps {
  mode: DrawingMode;
  shape: ShapeType;
  color: string;
  size: number;
  textSize: number;
  textColor: string;
  textFont: string;
  style: CanvasLineCap;
  text: string;

  onModeChange: (mode: DrawingMode) => void;
  onShapeChange: (shape: ShapeType) => void;
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
  onStyleChange: (style: CanvasLineCap) => void;
  onhandleTextChange: (text: string) => void;
  onhandleTextSizeChange: (textSize: number) => void;
  onhandleTextColorChange: (textColor: string) => void;
  onhandleTextFontChange: (textFont: string) => void;
}

export default function Toolbox({
  shape,
  mode,
  color,
  size,
  style,
  text,
  textSize,
  textColor,
  textFont,
  onModeChange,
  onShapeChange,
  onColorChange,
  onSizeChange,
  onStyleChange,
  onhandleTextChange,
  onhandleTextColorChange,
  onhandleTextSizeChange,
  onhandleTextFontChange,
}: ToolboxProps) {
  
  const handleModeChange2 = useCallback(
    (mode: String) => {
      onModeChange(mode as DrawingMode);
    },
    [onModeChange]
  );

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onColorChange(e.target.value);
    },
    [onColorChange]
  );

  const handleSizeChange2 = useCallback(
    (size: number[]) => {
      onSizeChange(size[0]);
    },
    [onSizeChange]
  );
  const handleShapeChange = useCallback((shape:ShapeType) => {
    
    onShapeChange(shape);
    }, [  onShapeChange]);


  const handleStyleChange2 = useCallback(
    (style: CanvasLineCap) => {

      onStyleChange(style);
      console.log(style);
      
    },
    [onStyleChange]
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onhandleTextChange(e.target.value);
    },
    [onhandleTextChange]
  );

  const handleTextSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onhandleTextSizeChange(Number(e.target.value));
    },
    [onhandleTextSizeChange]
  );

  const handleTextColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onhandleTextColorChange(e.target.value);
    },
    [onhandleTextColorChange]
  );

  const handleTextFontChange = useCallback(
    (TextFont: string) => {
      onhandleTextFontChange(TextFont);
    },
    [onhandleTextFontChange]
  );
 


  return (
    <div className="  border border-border rounded-sm  gap-2 p-2 w-screen  ">
    

      <div className=" gap-3 flex flex-col justify-between items-stretch " >
      {/* <Tabs  className=" flex flex-col gap-4    " 
          defaultValue={mode}

          onValueChange={handleModeChange2}
        >

          <TabsList  className="  gap-4 xl:flex-none   "  >
            <TabsTrigger value={DrawingMode.FreeDraw}>FreeDraw</TabsTrigger>
            <TabsTrigger value={DrawingMode.Erase}>Erase</TabsTrigger>
            <TabsTrigger value={DrawingMode.Text}>Text</TabsTrigger>
            <TabsTrigger value={DrawingMode.Select}>Select</TabsTrigger>
          </TabsList>
        </Tabs> */}
        <Select onValueChange={handleModeChange2}>
        <SelectTrigger className=" text-muted-foreground">
                  <SelectValue placeholder="Mode" defaultValue={mode} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DrawingMode.FreeDraw}>FreeDraw</SelectItem>
                <SelectItem value={DrawingMode.Erase}>Erase</SelectItem>
                <SelectItem value={DrawingMode.Text}>Text</SelectItem>
                <SelectItem value={DrawingMode.Select}>Select</SelectItem>
              </SelectContent>
            </Select>
       
        {mode === DrawingMode.Text && (
          <>
            <Label className=" text-muted-foreground"  > Text:</Label>
            <Input
              className=" text-muted-foreground"

              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder="Enter text"
            />
            <Label className=" text-muted-foreground" > Font-size :</Label>

            <Input
             className=" text-muted-foreground"
              type="number"
              value={textSize}
              onChange={handleTextSizeChange}
              placeholder="Font size"
            />
            <Label className=" text-muted-foreground" > Text-Color:</Label>

            <Input
             className=" text-muted-foreground"
              type="color"
              value={textColor}
              onChange={handleTextColorChange}
            />
            <Label className=" text-muted-foreground"> Text-Font:</Label>
            <Select onValueChange={handleTextFontChange}

            >
              <SelectTrigger className=" text-muted-foreground"
              >
                <SelectValue defaultValue={textFont} placeholder="Font Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
        {mode !== DrawingMode.Text && (
          <>
            <Label className=" text-muted-foreground">
              Color:
              <Input className=" text-muted-foreground"type="color" value={color} onChange={handleColorChange} />
            </Label>

            <Label className=" text-muted-foreground">
              Brush Size:
            </Label>
            <Slider
              defaultValue={[10]}
              max={100}
              min={1}
              onValueChange={handleSizeChange2}
            />


            <Label className=" text-muted-foreground">
              Brush Style:
            </Label>
            <Select onValueChange={handleStyleChange2}>
              <SelectTrigger className=" text-muted-foreground">
                <SelectValue defaultValue={style} placeholder="Brush Style" />
              </SelectTrigger>
              <SelectContent className=" text-muted-foreground">
                <SelectItem value="round">Round</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="butt">Butt</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
        {mode === DrawingMode.Select && (
          <>
          <Label className=" text-muted-foreground">
        Shape Style:
         </Label>
         <Select onValueChange={handleShapeChange} >
           <SelectTrigger className=" text-muted-foreground">
             <SelectValue defaultValue={shape} placeholder="Shape Style" />
           </SelectTrigger>
           <SelectContent className=" text-muted-foreground">
             <SelectItem value={ShapeType.Rectangle}>Rectangle</SelectItem>
              <SelectItem value={ShapeType.Circle}>Circle</SelectItem>
              <SelectItem value={ShapeType.Triangle}>Triangle</SelectItem>
              <SelectItem value={ShapeType.Line}>Line</SelectItem>
              <SelectItem value={ShapeType.Triangle}>Triangle</SelectItem>
              <SelectItem value={ShapeType.Arrow}>Arrow</SelectItem>
              <SelectItem value={ShapeType.Diamond}>Diamond</SelectItem>
              <SelectItem value={ShapeType.Pentagon}>Pentagon</SelectItem>
              <SelectItem value={ShapeType.Hexagon}>Hexagon</SelectItem>
              <SelectItem value={ShapeType.Octagon}>Octagon</SelectItem>
           </SelectContent>
         </Select>
           
       </>

      )}
      </div>
    </div>
  );
}
