import {useEffect, useRef, useState} from "react";
import "./index.css"
import {blueYellowPalette, firePalette, pasteleRainbowPalette, rainbowPalette} from "./Colors.ts";
import {Coordinates, ISet, RGBColor} from "./types.ts";
import MandelbrotWorker from "./mandelbrotWorker?worker";
import JuliaWorker from "./juliaWorker?worker";
import colorsImage from "../../assets/images/colors.png";
import affineImage from "../../assets/images/affine.png";
import {NavLink} from "react-router-dom";
import learningIcon from "../../assets/images/learning.png";
function FractalPage() {
    const [isJulia, setIsJulia] = useState(false);
    const [isViscek, setIsViscek] = useState(false);
    const [isAlgebraic, setIsAlgebraic] = useState(true);
    const [primalDepth, setPrimalDepth] = useState<number>(3);
    const [chosedFractal, setChosedFractal] = useState<string>("Mandelbrot");
    const [chosedPalette, setChosedPalette] = useState<string>("BlueYellow");
    const [cx, setCx] = useState<number>(-0.8);
    const [cy, setCy] = useState<number>(0.156);
    const inputWorkersRef = useRef<HTMLInputElement>(null);
    const inputIterationsRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const HEIGHT: number = 600;
    const WIDTH: number = 600;


    const REAL_SET = useRef<ISet>({start: -2, end: 2})
    const IMAGINARY_SET = useRef<ISet>({start: -2, end: 2})
    const ZOOM_IN_FACTOR: number = 0.3;
    const ZOOM_OUT_FACTOR: number = 1.3;
    const workers: Worker[] = [];
    let TASKS: number[][];

    let colorPalette: RGBColor[] = [];


    function FillTasks(length: number) {
        const workerCount: number = Number(inputWorkersRef.current!.value);
        TASKS = [];
        for (let i = 0; i < workerCount; i++) {
            TASKS.push([]);
        }
        for (let i = 0; i < length; i++) {
            TASKS[i % workerCount].push(i);
        }
    }

    function setPalette() {
        switch (chosedPalette) {
            case "Rainbow":
                colorPalette = rainbowPalette();
                break;
            case "PastelRainbow":
                colorPalette = pasteleRainbowPalette();
                break;
            case "Fire":
                colorPalette = firePalette();
                break;
            case "BlueYellow":
                colorPalette = blueYellowPalette();
                break;
            default:
                colorPalette = [{r: 255, g: 255, b: 255}];
        }
    }

    function drawFractal() {
        setIsJulia(false);
        setIsViscek(false);
        setIsAlgebraic(false);
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const ctx: CanvasRenderingContext2D | null = canvas ? canvas.getContext('2d', {alpha: false}) : null;
        ctx!.imageSmoothingEnabled = true;
        ctx!.imageSmoothingQuality = "high";
        switch (chosedFractal) {
            case "Mandelbrot":
                drawMandelbrotJulia();
                break;
            case "Julia":
                setIsJulia(true);
                drawMandelbrotJulia();
                break;
            case "Vicsek":
                setIsViscek(true);
                clearCanvas();
                ctx!.fillStyle = 'rgb(255,255,255)';
                drawVicsek(0, 0, primalDepth, WIDTH);
                break;
            case "CrossVicsek":
                setIsViscek(true);
                clearCanvas();
                ctx!.fillStyle = 'rgb(255,255,255)';
                drawCrossVicsek(0, 0, primalDepth, WIDTH);
        }
    }

    function drawVicsek(x: number, y: number, depth: number, length: number) {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const ctx: CanvasRenderingContext2D | null = canvas ? canvas.getContext('2d') : null;
        if (depth === 0) {
            ctx!.fillRect(x, y, length, length);
        } else {
            const newLength = length / 3;
            const offset = newLength * 2;

            // Draw the central square
            drawVicsek(x + newLength, y + newLength, depth - 1, newLength);

            // Draw the surrounding squares
            drawVicsek(x, y, depth - 1, newLength);
            drawVicsek(x + offset, y, depth - 1, newLength);
            drawVicsek(x, y + offset, depth - 1, newLength);
            drawVicsek(x + offset, y + offset, depth - 1, newLength);
        }
    }

    function drawCrossVicsek(x: number, y: number, depth: number, length: number) {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const ctx: CanvasRenderingContext2D | null = canvas ? canvas.getContext('2d') : null;
        if (depth === 0) {
            ctx!.fillRect(x, y, length, length);
        } else {
            const newLength = length / 3;

            // Draw the central square
            drawCrossVicsek(x + newLength, y + newLength, depth - 1, newLength);

            // Draw the surrounding squares
            drawCrossVicsek(x + newLength, y, depth - 1, newLength);
            drawCrossVicsek(x, y + newLength, depth - 1, newLength);
            drawCrossVicsek(x + newLength * 2, y + newLength, depth - 1, newLength);
            drawCrossVicsek(x + newLength, y + newLength * 2, depth - 1, newLength);
        }
    }

    function clearCanvas() {
        for (let i = 0; i < workers.length; i++) {
            if (workers[i])
                workers[i].terminate();
        }
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const ctx: CanvasRenderingContext2D | null = canvas ? canvas.getContext('2d') : null;
        ctx!.fillStyle = 'rgb(255,255,255)';
        ctx!.clearRect(0, 0, WIDTH, HEIGHT);
    }

    function drawMandelbrotJulia() {
        setPalette();
        setIsAlgebraic(true);
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const ctx: CanvasRenderingContext2D | null = canvas ? canvas.getContext('2d', {alpha: false}) : null;
        const workerCount: number = Number(inputWorkersRef.current!.value);
        FillTasks(HEIGHT);
        for (let i = 0; i < workerCount; i++) {
            if (workers[i])
                workers[i].terminate();
            workers[i] = chosedFractal == "Julia" ? new JuliaWorker() : new MandelbrotWorker()
            workers[i].postMessage({
                w: WIDTH,
                h: HEIGHT,
                realSet: REAL_SET.current,
                imaginarySet: IMAGINARY_SET.current,
                maxIterations: inputIterationsRef.current!.value,
                colorPalette,
                c: {x: cx, y: cy},
                isSettingUp: true
            })
            workers[i].postMessage({row: TASKS[i].shift()});

            workers[i].onmessage = res => {
                if (TASKS[i].length > 0)
                    workers[i].postMessage({row: TASKS[i].shift()})

                const {row, bitmap} = res.data;
                ctx!.drawImage(bitmap, 0, row, WIDTH, 1);
            }
        }
    }


    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const ctx: CanvasRenderingContext2D | null = canvas ? canvas.getContext('2d') : null;
        ctx!.canvas.width = WIDTH;
        ctx!.canvas.height = HEIGHT;
        setPalette();
        drawFractal();
        return (() => {
            for (let i = 0; i < workers.length; i++) {
                if (workers[i])
                    workers[i].terminate();
            }
        })
    }, [])

    useEffect(() => {
        REAL_SET.current = {start: -2, end: 2};
        IMAGINARY_SET.current = {start: -2, end: 2};
    }, [chosedFractal])

    function ZoomIn(clientCoord: Coordinates) {

        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const zfw = (WIDTH * ZOOM_IN_FACTOR)
        const zfh = (HEIGHT * ZOOM_IN_FACTOR)

        REAL_SET.current = {
            start: getRelativePoint(clientCoord.x - canvas!.offsetLeft - zfw, WIDTH, REAL_SET.current),
            end: getRelativePoint(clientCoord.x - canvas!.offsetLeft + zfw, WIDTH, REAL_SET.current)
        }
        IMAGINARY_SET.current = {
            start: getRelativePoint(clientCoord.y - canvas!.offsetTop - zfh, HEIGHT, IMAGINARY_SET.current),
            end: getRelativePoint(clientCoord.y - canvas!.offsetTop + zfh, HEIGHT, IMAGINARY_SET.current)
        }

        drawFractal();
    }

    function ZoomOut(clientCoord: Coordinates) {

        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const zfw = (WIDTH / ZOOM_OUT_FACTOR)
        const zfh = (HEIGHT / ZOOM_OUT_FACTOR)

        REAL_SET.current = {
            start: getRelativePoint(clientCoord.x - canvas!.offsetLeft - zfw, WIDTH, REAL_SET.current),
            end: getRelativePoint(clientCoord.x - canvas!.offsetLeft + zfw, WIDTH, REAL_SET.current)
        }
        IMAGINARY_SET.current = {
            start: getRelativePoint(clientCoord.y - canvas!.offsetTop - zfh, HEIGHT, IMAGINARY_SET.current),
            end: getRelativePoint(clientCoord.y - canvas!.offsetTop + zfh, HEIGHT, IMAGINARY_SET.current)
        }

        if (REAL_SET.current.start < -2 || REAL_SET.current.end > 2
            || IMAGINARY_SET.current.start < -2 || IMAGINARY_SET.current.end > 2) {
            REAL_SET.current = {start: -2, end: 2};
            IMAGINARY_SET.current = {start: -2, end: 2};
        }

        drawFractal();
    }

    function onWheelHandler(e: React.WheelEvent) {
        if (e.deltaY < 0)
            ZoomIn({x: e.clientX, y: e.clientY});
        else {
            ZoomOut({x: e.clientX, y: e.clientY});
        }
    }

    const getRelativePoint = (pixel: number, length: number, set: ISet) =>
        set.start + (pixel / length) * (set.end - set.start)

    function onChangeDepthHandler(e: React.ChangeEvent<HTMLInputElement>) {
        let newValue = Number(e.target.value);
        if (newValue < 0)
            newValue = 0;
        if (newValue > 7) {
            alert("Value cannot be greater than 7")
            newValue = 7;
        }
        setPrimalDepth(Math.floor(newValue));
    }

    useEffect(() => {
        drawFractal();
        return () => {
            workers.forEach((x) => x.terminate());
            TASKS = [[]];
        }
    }, [primalDepth, chosedFractal, colorPalette])

    return <div className="page">
        <header className="header">
            <NavLink to="/affine" className="navigationButton">
                <img className="navImageButton" alt="affine image" src={affineImage}/>
                <div className="navTextDiv"><span style={{marginInline: "15px"}}>Affine</span></div>
            </NavLink>
            <NavLink className="homeNavLink" to="/">Computer Graphics</NavLink>
            <NavLink to="/colors" className="navigationButton">
                <img className="navImageButton" alt="colors image" src={colorsImage}/>
                <div className="navTextDiv"><span style={{marginInline: "15px"}}>Colors</span></div>
            </NavLink>
        </header>
        <NavLink to="/learning-material/fractals">
            <button className="learningButton"  style={{top:"100px",right:"30px",backgroundColor:"rgba(0,0,0,75%)"}}>
                <img src={learningIcon} alt="Download icon"/>
            </button>
        </NavLink>
        <div className="contentDiv">
            <div className="fractalDiv">
                <canvas className="fractalImage" ref={canvasRef} onWheel={onWheelHandler}/>
            </div>
            <ul className="colorPaletteInput">
                <li hidden={!isAlgebraic}
                    className={"colorPaletteOption BlueYellow" + (chosedPalette === "BlueYellow" ? " colorPaletteOptionChosen" : "")}
                    onClick={() => setChosedPalette("BlueYellow")}
                    value="BlueYellow"></li>
                <li hidden={!isAlgebraic}
                    className={"colorPaletteOption Rainbow" + (chosedPalette === "Rainbow" ? " colorPaletteOptionChosen" : "")}
                    onClick={() => setChosedPalette("Rainbow")}
                    value="Rainbow"></li>
                <li hidden={!isAlgebraic}
                    className={"colorPaletteOption PastelRainbow" + (chosedPalette === "PastelRainbow" ? " colorPaletteOptionChosen" : "")}
                    onClick={() => setChosedPalette("PastelRainbow")}
                    value="PasteleRainbow"></li>
                <li hidden={!isAlgebraic}
                    className={"colorPaletteOption Fire" + (chosedPalette === "Fire" ? " colorPaletteOptionChosen" : "")}
                    onClick={() => setChosedPalette("Fire")} value="Fire"></li>
            </ul>
            <div className="settingsDiv">
                <div className="selectFractalContainer">
                    <ul className="input selectFractal">
                        <li className={chosedFractal === "Mandelbrot" ? "fractalOptionSelected" : "fractalOption"}
                            onClick={() => setChosedFractal("Mandelbrot")}>Mandelbrot
                        </li>
                        <li className={chosedFractal === "Julia" ? "fractalOptionSelected" : "fractalOption"}
                            onClick={() => setChosedFractal("Julia")}>Julia
                        </li>
                        <li className={chosedFractal === "Vicsek" ? "fractalOptionSelected" : "fractalOption"}
                            onClick={() => setChosedFractal("Vicsek")}>Vicsek
                        </li>
                        <li className={chosedFractal === "CrossVicsek" ? "fractalOptionSelected" : "fractalOption"}
                            onClick={() => setChosedFractal("CrossVicsek")}>Cross Vicsek
                        </li>
                    </ul>
                </div>
                <div className="optionsDiv">
                    {isJulia && <div className="constantValueDiv">
                        <label>Real part<br/>
                            <div className="inputNumber">
                                <input className="input" type="number" value={cx} step="0.01"
                                       onChange={(e) => (Number(e.target.value) >= -2 && Number(e.target.value) <= 2) && setCx(Number(e.target.value))}></input>
                                <div className="inputNumberArrowsContainer">
                                    <button className="inputNumberArrowButton"
                                            onClick={() => cx < 2 && setCx((x) => Number((x + 0.01).toFixed(6)))}>▲
                                    </button>
                                    <button className="inputNumberArrowButton"
                                            onClick={() => cx > -2 && setCx((x) => Number((x - 0.01).toFixed(6)))}>▼
                                    </button>
                                </div>
                            </div>
                        </label>
                        <label>Imaginary part<br/>
                            <div className="inputNumber">
                                <input className="input" type="number" value={cy} step="0.01"
                                       onChange={(e) => (Number(e.target.value) >= -2 && Number(e.target.value) <= 2) && setCy(Number(e.target.value))}></input>
                                <div className="inputNumberArrowsContainer">
                                    <button className="inputNumberArrowButton"
                                            onClick={() => cy < 2 && setCy((x) => Number((x + 0.01).toFixed(6)))}>▲
                                    </button>
                                    <button className="inputNumberArrowButton"
                                            onClick={() => cy > -2 && setCy((x) => Number((x - 0.01).toFixed(6)))}>▼
                                    </button>
                                </div>
                            </div>
                        </label>
                        <button className="infoButton">i</button>
                        <div className="juliaInfoDiv">These numbers affect how the fractal will look. Here are some examples of interesting cases of the Julia fractal: (−0.4; 0.6), (0.285; 0.01), (−0.835; 0.2321), (−0.8; 0.156), (0; 0.8), (0.35; 0.35), (0.4; 0.4)</div>
                    </div>}
                    <div  style={{display:"flex"}}>
                    <label hidden={!isAlgebraic}>Number of workers<br/>
                        <div className="inputNumber">
                            <input type="number" readOnly={true} className="input" ref={inputWorkersRef}
                                   defaultValue={window.navigator.hardwareConcurrency}/>
                            <div className="inputNumberArrowsContainer">
                                <button className="inputNumberArrowButton" onClick={() => {
                                    if (Number(inputWorkersRef.current!.value) < window.navigator.hardwareConcurrency)
                                        inputWorkersRef.current!.value = (Number(inputWorkersRef.current!.value) + 1).toString();
                                }}>▲
                                </button>
                                <button className="inputNumberArrowButton" onClick={() => {
                                    if (Number(inputWorkersRef.current!.value) > 1)
                                        inputWorkersRef.current!.value = (Number(inputWorkersRef.current!.value) - 1).toString();
                                }}>▼
                                </button>
                            </div>
                        </div>
                    </label>
                    <button hidden={!isAlgebraic} className="infoButton" style={{marginTop:"45px"}}>i</button>
                    <div className="juliaInfoDiv" style={{transform:"translateY(-65%) translateX(-15%)"}}>Number of CPs participating in fractal calculation and drawing. The more workers - the faster is drawing. Maximum amount equals to cores of your PC</div>
                    </div>
                    <label hidden={!isAlgebraic}>Max iterations<br/>
                        <div className="inputNumber">
                            <input type="number" className="input" ref={inputIterationsRef} defaultValue={100}
                                   onChange={() => drawFractal()}/>
                            <div className="inputNumberArrowsContainer">
                                <button className="inputNumberArrowButton" onClick={() => {
                                    inputIterationsRef.current!.value = (Number(inputIterationsRef.current!.value) + 1).toString();
                                    drawFractal();
                                }}>▲
                                </button>
                                <button className="inputNumberArrowButton" onClick={() => {
                                    inputIterationsRef.current!.value = (Number(inputIterationsRef.current!.value) - 1).toString();
                                    drawFractal();
                                }}>▼
                                </button>
                            </div>
                        </div>
                    </label>
                    {isViscek &&
                        <label>Depth<br/>
                            <div className="inputNumber">
                                <input className="input" readOnly={true} style={{width: "5vw"}} type="number"
                                       value={primalDepth} onChange={onChangeDepthHandler}/>
                                <div className="inputNumberArrowsContainer">
                                    <button className="inputNumberArrowButton"
                                            onClick={() => primalDepth < 8 && setPrimalDepth((x) => ++x)}>▲
                                    </button>
                                    <button className="inputNumberArrowButton"
                                            onClick={() => primalDepth > 0 && setPrimalDepth((x) => --x)}>▼
                                    </button>
                                </div>
                            </div>
                        </label>}
                </div>
            </div>
        </div>
    </div>
}

export default FractalPage;