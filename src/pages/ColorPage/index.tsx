import "./index.css"
import uploadIcon from "./upload.png"
import downloadIcon from "./download.png"
import placeHolder from "./Placeholder.jpg"
import {useEffect, useRef, useState} from "react";
import {CMYKColor, HSVColor, Point, RGBColor} from "./types.ts";
import colorConvert from 'color-convert';
import {NavLink} from "react-router-dom";
import affineImage from "../../assets/images/affine.png";
import fractalImage from "../../assets/images/fractal.png";


function ColorPage() {
    const [file, setFile] = useState<File>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pickedColorRef = useRef<HTMLDivElement>(null);
    const hoveredColorRef = useRef<HTMLDivElement>(null);
    const currentRgbColorRef = useRef<RGBColor>({r:0,g:0,b:0});
    const hsvLabelRef = useRef<HTMLDivElement>(null);
    const cmykLabelRef = useRef<HTMLDivElement>(null);
    const firstPointRef = useRef<Point>({x:0,y:0});
    const secondPointRef = useRef<Point>({x:0,y:0});
    const isSelectModeRef = useRef<boolean>(false)
    const valueRangeRef = useRef<HTMLInputElement>(null);
    const cyanRangeRef = useRef<HTMLInputElement>(null);
    const selectionModeNameRef = useRef<HTMLSpanElement>(null);
    const pickerModeNameRef = useRef<HTMLSpanElement>(null);

    const image = new Image();
    image.onload = () => {
        const ctx = canvasRef.current?.getContext("2d");
        ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        ctx?.drawImage(image, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
    }
    image.src = file ? URL.createObjectURL(file as Blob) : placeHolder;

    useEffect(() => {
        const ctx = canvasRef.current!.getContext('2d');
        ctx!.canvas.width = canvasRef.current!.clientWidth;
        ctx!.canvas.height = canvasRef.current!.clientHeight;
    })

    return (<div className="page">
        <header className="header">
            <NavLink to="/fractals" className="navigationButton">
                <img className="navImageButton" alt="affine image" src={fractalImage}/>
                <div className="navTextDiv"><span style={{marginInline:"15px"}}>Fractal</span></div>
            </NavLink>
            <NavLink to="/affine" className="navigationButton">
                <img className="navImageButton" alt="colors image" src={affineImage}/>
                <div className="navTextDiv"><span style={{marginInline:"15px"}}>Affine</span></div>
            </NavLink>
        </header>
        <div className="contentDiv">
            <div className="pictureDiv">
                <canvas ref={canvasRef} className="canvas"
                        onClick={onColorClickHandler}
                        onMouseMove={(e) => {
                            const hoveredColorDiv = hoveredColorRef.current!;
                            pick(e, hoveredColorRef.current!);
                            hoveredColorDiv.style.left = (e.pageX + 5) + "px";
                            hoveredColorDiv.style.top = (e.pageY - 35) + "px";
                        }}
                        onMouseEnter={() => hoveredColorRef.current!.hidden = false}
                        onMouseLeave={() => hoveredColorRef.current!.hidden = true}
                        onMouseDown={(e)=>{
                            if(!isSelectModeRef.current!)
                                return;
                            const bounding = canvasRef.current!.getBoundingClientRect();
                            const x = e.clientX - bounding.left;
                            const y = e.clientY - bounding.top;
                            firstPointRef.current = {x,y};
                        }}
                        onMouseUp={({clientX,clientY})=>{
                            if(!isSelectModeRef.current!)
                                return;
                            const bounding = canvasRef.current!.getBoundingClientRect();
                            const x = clientX - bounding.left;
                            const y = clientY - bounding.top;
                            secondPointRef.current = {x,y};
                            drawSelectionRectangle();
                        }}/>
                <div ref={hoveredColorRef} hidden={true} className="hoveredColor"
                     onMouseEnter={(e) => hoveredColorRef.current!.style.left = e.pageX + 5 + "px"}></div>
                <div className="loadSaveButtons">
                    <label className="loadImageButton">
                        <img src={uploadIcon} alt="Upload icon"/>
                        <input onChange={(e) => e.target.files![0] && setFile(e.target.files![0])}
                               type="file" accept="image/*"/>
                    </label>
                    <button className="loadImageButton" onClick={() => saveHandler()}>
                        <img src={downloadIcon} alt="Download icon"/>
                    </button>
                </div>
            </div>
            <div className="settingsDiv">
                <div ref={pickedColorRef} className="pickedColor"></div>
                <div className="colorContainer">HSV<div ref={hsvLabelRef} className="colorValueContainer"></div></div>
                <div className="colorContainer">CMYK<div ref={cmykLabelRef}  className="colorValueContainer"></div></div>
                <label className="modePicker">Mode
                <label className="switch">
                    <span ref={pickerModeNameRef} className="modeName" >Color Picker</span>
                    <input type="checkbox" defaultValue="false" onClick={()=> {
                        isSelectModeRef.current = !isSelectModeRef.current!;
                        selectionModeNameRef.current!.style.opacity = isSelectModeRef.current!?"1":"0";
                        pickerModeNameRef.current!.style.opacity = !isSelectModeRef.current!?"1":"0";
                        canvasRef.current!.getContext('2d')!
                            .drawImage(image, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
                    }}/>
                    <span className="slider round"></span>
                    <span ref={selectionModeNameRef} className="modeName">Selection</span>
                </label>
                </label>
                <label className="valueRange">Value<br/>
                    <span>0%<input ref={valueRangeRef} type="range" min={0} max={2} step={0.01} defaultValue={1}></input>200%</span>
                </label>
                <label className="valueRange">Cyan<br/>
                    <span>0%<input ref={cyanRangeRef} type="range" min={0} max={2} step={0.01} defaultValue={1}></input>200%</span>
                </label>
                <button className="button" onClick={()=>{
                    changeFragmentColor();
                    valueRangeRef.current!.value = "1";
                    cyanRangeRef.current!.value = "1";
                }}>Draw</button>
            </div>
        </div>
    </div>)

    function pick(event: any, destination: HTMLDivElement) {
        const ctx = canvasRef.current!.getContext("2d");
        const bounding = canvasRef.current!.getBoundingClientRect();
        const x = event.clientX - bounding.left;
        const y = event.clientY - bounding.top;
        const pixel = ctx!.getImageData(x, y, 1, 1);
        const data = pixel.data;

        const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        destination.style.background = rgba;
        //destination.textContent = rgba;

        return {r:data[0],g:data[1],b:data[2]};
    }

    function onColorClickHandler(e :any) {
        console.log(isSelectModeRef);
        if(isSelectModeRef.current!)
            return;
        currentRgbColorRef.current = pick(e, pickedColorRef.current!)
        hsvLabelRef.current!.textContent = rgbToHsv(currentRgbColorRef.current).h
            + ", " +rgbToHsv(currentRgbColorRef.current).s
            + "%, " +rgbToHsv(currentRgbColorRef.current).v + "%";
        cmykLabelRef.current!.textContent = rgbToCmyk(currentRgbColorRef.current).c
            + ", " +rgbToCmyk(currentRgbColorRef.current).m
            + ", " +rgbToCmyk(currentRgbColorRef.current).y
            + ", " +rgbToCmyk(currentRgbColorRef.current).k
    }

    function saveHandler() {
        const link = document.createElement('a');
        link.download = 'picture.png';
        link.href = canvasRef.current!.toDataURL();
        link.click();
    }
    function rgbToCmyk({r,g,b}:RGBColor):CMYKColor {
        const r1 = r / 255;
        const g1 = g / 255;
        const b1 = b / 255;

        const k = +(1 - Math.max(r1, g1, b1)).toFixed(2);
        const c = +((1 - r1 - k) / (1 - k) || 0).toFixed(2);
        const m = +((1 - g1 - k) / (1 - k) || 0).toFixed(2);
        const y = +((1 - b1 - k) / (1 - k) || 0).toFixed(2);

        return {c, m, y, k}
    }

    function rgbToHsv({r,g,b}:RGBColor) :HSVColor{
        let rr, gg, bb, h = 0, s, v: number, diff : number;
        const rabs = r / 255;
        const gabs = g / 255;
        const babs = b / 255;
        v = Math.max(rabs, gabs, babs),
            diff = v - Math.min(rabs, gabs, babs);
        const diffc = (c:number)=> (v - c) / 6 / diff + 1 / 2;
        const percentRoundFn = (num:number) => Math.round(num * 100) / 100;
        if (diff == 0) {
            h = s = 0;
        } else {
            s = diff / v;
            rr = diffc(rabs);
            gg = diffc(gabs);
            bb = diffc(babs);

            if (rabs === v) {
                h = bb - gg;
            } else if (gabs === v) {
                h = (1 / 3) + rr - bb;
            } else if (babs === v) {
                h = (2 / 3) + gg - rr;
            }
            if (h < 0) {
                h += 1;
            }else if (h > 1) {
                h -= 1;
            }
        }
        return {
            h: Math.round(h * 360),
            s: percentRoundFn(s * 100),
            v: percentRoundFn(v * 100)
        };
    }

    function changeFragmentColor() {
        const firstX = Math.round(Math.min(firstPointRef.current.x, secondPointRef.current.x));
        const firstY = Math.round(Math.min(firstPointRef.current.y, secondPointRef.current.y));
        const secondX = Math.round(Math.max(firstPointRef.current.x, secondPointRef.current.x));
        const secondY = Math.round(Math.max(firstPointRef.current.y, secondPointRef.current.y));
        const ctx = canvasRef.current!.getContext('2d');
        ctx!.globalAlpha = 1.0;

        ctx?.drawImage(image, 0, 0, canvasRef.current!.width, canvasRef.current!.height);

        const imageData = ctx!.getImageData(firstX,firstY,secondX-firstX,secondY-firstY);
        const data = imageData.data;
        for (let i = 0; i < data.length;  i+=4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3] / 255;
            const cmyk = colorConvert.rgb.cmyk([r, g, b]);
            cmyk[0] *= Number(cyanRangeRef.current!.value);
            cmyk[0] = Math.min(100, Math.max(0, cmyk[0]));
            const hsv = colorConvert.cmyk.hsv(cmyk);
            hsv[2] *= Number(valueRangeRef.current!.value);
            hsv[2] = Math.min(100, Math.max(0, hsv[2]));
            const rgb = colorConvert.hsv.rgb(hsv);
            data[i] = rgb[0];
            data[i + 1] = rgb[1];
            data[i + 2] = rgb[2];
            data[i + 3] = a * 255;
        }
        ctx!.putImageData(imageData, firstX, firstY);
        image.src = canvasRef.current!.toDataURL();
    }
    function drawSelectionRectangle(){
        const ctx = canvasRef.current?.getContext("2d");
        ctx?.drawImage(image, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
        const firstX = Math.min(firstPointRef.current.x, secondPointRef.current.x);
        const firstY = Math.min(firstPointRef.current.y, secondPointRef.current.y);
        const secondX = Math.max(firstPointRef.current.x, secondPointRef.current.x);
        const secondY = Math.max(firstPointRef.current.y, secondPointRef.current.y);
        ctx!.globalAlpha = 1.0;
        ctx!.fillStyle = "rgba(0,0,0,0.25)"
        for (let i = firstX-1; i <= secondX; i++) {
            ctx!.fillRect(i,firstY,1,1);
            ctx!.fillRect(i,secondY,1,1);
        }
        for (let i = firstY; i <= secondY; i++) {
            ctx!.fillRect(firstX,i,1,1);
            ctx!.fillRect(secondX, i,1,1);
        }
    }
}

export default ColorPage;