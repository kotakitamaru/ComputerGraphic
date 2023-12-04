import {useEffect, useRef} from "react";
import {Point, Square} from './Square.ts';
import "./index.css";
import {NavLink} from "react-router-dom";
import colorsImage from "../../assets/images/colors.png";
import fractalImage from "../../assets/images/fractal.png";


function AffinePage(){
    const FRAMES_PER_SECONDS = 30

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const squareRef = useRef<Square>(new Square(
        new Point(10,10),
        new Point(100,10),
        new Point(100,100),
        new Point(10,100)))
    //Square drawing
    const squareFirstPointXInputRef = useRef<HTMLInputElement>(null);
    const squareFirstPointYInputRef = useRef<HTMLInputElement>(null);
    const squareSecondPointXInputRef = useRef<HTMLInputElement>(null);
    const squareSecondPointYInputRef = useRef<HTMLInputElement>(null);
    //Translate
    const translateXInputRef = useRef<HTMLInputElement>(null);
    const translateYInputRef = useRef<HTMLInputElement>(null);
    //Scale
    const scaleXInputRef = useRef<HTMLInputElement>(null);
    const scaleYInputRef = useRef<HTMLInputElement>(null);
    //Rotation
    const rotationAngleRef = useRef<HTMLInputElement>(null);

    const handleResize = () =>{
        const ctx = canvasRef.current!.getContext('2d');
        ctx!.canvas.width = canvasRef.current!.clientWidth;
        ctx!.canvas.height = canvasRef.current!.clientHeight;
        drawSquare(squareRef.current);
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize, false);
        handleResize();
    })


    return <div className="page">
        <header className="header">
            <NavLink to="/colors" className="navigationButton">
                <img className="navImageButton" alt="affine image" src={colorsImage}/>
                <div className="navTextDiv"><span style={{marginInline:"15px"}}>Colors</span></div>
            </NavLink>
            <NavLink to="/fractals" className="navigationButton">
                <img className="navImageButton" alt="colors image" src={fractalImage}/>
                <div className="navTextDiv"><span style={{marginInline:"15px"}}>Fractal</span></div>
            </NavLink>
        </header>
        <div className="contentDiv">
            <canvas className="squareCanvas" ref={canvasRef}></canvas>
            <div className="settingsDiv">
                <div className="squareInputDiv">Square<br/>
                    <div className="pointInputDiv">First point<br/>
                        X:<input className="pointInput" ref={squareFirstPointXInputRef} type="number" defaultValue={10}></input>
                        Y:<input className="pointInput" ref={squareFirstPointYInputRef} type="number" defaultValue={10}></input>
                    </div>
                    <div className="pointInputDiv">Second point<br/>
                        X:<input className="pointInput" ref={squareSecondPointXInputRef} type="number" defaultValue={100}></input>
                        Y:<input className="pointInput" ref={squareSecondPointYInputRef} type="number" defaultValue={100}></input>
                    </div>
                    <button className="button" onClick={()=>{
                        squareRef.current = new Square(
                            new Point(parseInt(squareFirstPointXInputRef.current!.value)
                                ,parseInt(squareFirstPointYInputRef.current!.value)),
                            new Point(parseInt(squareSecondPointXInputRef.current!.value)
                                ,parseInt(squareFirstPointYInputRef.current!.value)),
                            new Point(parseInt(squareSecondPointXInputRef.current!.value)
                                ,parseInt(squareSecondPointYInputRef.current!.value)),
                            new Point(parseInt(squareFirstPointXInputRef.current!.value)
                                ,parseInt(squareSecondPointYInputRef.current!.value)))
                        drawSquare(squareRef.current);
                    }}>Draw</button>
                </div>
                <div className="squareInputDiv" >Affine
                <div className="pointInputDiv">Translate<br/>
                    <input className="pointInput" ref={translateXInputRef} defaultValue={0} type="number"></input>
                    <input className="pointInput" ref={translateYInputRef} defaultValue={0} type="number"></input>
                </div>
                <div className="pointInputDiv">Scale<br/>
                    <input className="pointInput" ref={scaleXInputRef} defaultValue={1} type="number"></input>
                    <input className="pointInput" ref={scaleYInputRef} defaultValue={1} type="number"></input>
                </div>
                <div className="pointInputDiv">Rotate<br/>
                    <input className="pointInput" ref={rotationAngleRef} defaultValue={0} type="number"></input>°
                </div>
                <button className="button" onClick={ApplyHandler}>Apply</button>
                </div>
            </div>
        </div>

    </div>
    function drawSquare(square: Square) {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if(ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#7CB39E"; // колір заливки
                ctx.beginPath();
                ctx.moveTo(square.topLeft.x, square.topLeft.y);
                ctx.lineTo(square.topRight.x, square.topRight.y);
                ctx.lineTo(square.bottomRight.x, square.bottomRight.y);
                ctx.lineTo(square.bottomLeft.x, square.bottomLeft.y);
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    async function ApplyHandler(){
        for(let i = 0; i < FRAMES_PER_SECONDS; i++) {
            const transPoint = new Point(
                parseInt(translateXInputRef.current!.value)/FRAMES_PER_SECONDS
                , parseInt(translateYInputRef.current!.value)/FRAMES_PER_SECONDS)
            squareRef.current.translate(transPoint.x, transPoint.y);
            const scalePoint = new Point(
                (Math.pow(squareRef.current.topLeft.x*Number(scaleXInputRef.current!.value)/squareRef.current.topLeft.x,1/(FRAMES_PER_SECONDS-1))),
                (Math.pow(squareRef.current.bottomRight.y*Number(scaleYInputRef.current!.value)/squareRef.current.bottomRight.y,1/(FRAMES_PER_SECONDS-1))))
            if (scalePoint.x != 0 && scalePoint.y != 0) {
                squareRef.current.scale(scalePoint.x, scalePoint.y);
            }
            const rotationAngle = Number(rotationAngleRef.current!.value)/FRAMES_PER_SECONDS;
            if (rotationAngle > 0) {
                squareRef.current.rotate(rotationAngle)
            }
            drawSquare(squareRef.current);
            await sleep(1000/FRAMES_PER_SECONDS);
        }
    }

    function sleep(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
export default AffinePage;