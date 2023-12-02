import {useEffect, useRef} from "react";
import {Point, Square} from './Square.ts';
import "./index.css";


function AffinePage(){
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
        <header className="header"></header>
        <div className="contentDiv">
            <canvas className="squareCanvas" ref={canvasRef}></canvas>
            <div className="settingsDiv">
                <div>Square<br/>
                    <input ref={squareFirstPointXInputRef} type="number" defaultValue={10}></input>
                    <input ref={squareFirstPointYInputRef} type="number" defaultValue={10}></input>
                    <br/>
                    <input ref={squareSecondPointXInputRef} type="number" defaultValue={100}></input>
                    <input ref={squareSecondPointYInputRef} type="number" defaultValue={100}></input>
                </div>
                <button onClick={()=>{
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
                <div>Translate<br/>
                    <input ref={translateXInputRef} type="number"></input>
                    <input ref={translateYInputRef} type="number"></input>
                </div>
                <div>Scale<br/>
                    <input ref={scaleXInputRef} type="number"></input>
                    <input ref={scaleYInputRef} type="number"></input>
                </div>
                <div>Rotate<br/>
                    <input ref={rotationAngleRef} type="number"></input>
                </div>
                <button onClick={ApplyHandler}>Apply</button>

            </div>
        </div>

    </div>
    function drawSquare(square: Square) {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if(ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#00F"; // колір заливки
                ctx.beginPath();
                ctx.moveTo(square.topLeft.x, square.topLeft.y);
                ctx.lineTo(square.topRight.x, square.topRight.y);
                ctx.lineTo(square.bottomRight.x, square.bottomRight.y);
                ctx.lineTo(square.bottomLeft.x, square.bottomLeft.y);
                ctx.closePath();
                ctx.fill();
                //ctx.fillRect(square.topLeft.x, square.topLeft.y, square.bottomRight.x - square.topLeft.x, square.bottomRight.y - square.topLeft.y);
            }
        }
    }

    function ApplyHandler(){
        const transPoint = new Point(
            parseInt(translateXInputRef.current!.value)
            ,parseInt(translateYInputRef.current!.value))
        squareRef.current.translate(transPoint.x,transPoint.y);
        const scalePoint = new Point(Number(scaleXInputRef.current!.value),Number(scaleYInputRef.current!.value))
        if(scalePoint.x != 0 && scalePoint.y != 0){
            squareRef.current.scale(scalePoint.x,scalePoint.y);
        }
        const rotationAngle = Number(rotationAngleRef.current!.value);
        if(rotationAngle > 0) {
            squareRef.current.rotate(rotationAngle)
        }
        drawSquare(squareRef.current);
    }
}
export default AffinePage;