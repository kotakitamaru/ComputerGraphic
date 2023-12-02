import {Coordinates, ISet, RGBColor} from "./types.ts";

let WIDTH:number, HEIGHT:number, REAL_SET:ISet, IMAGINARY_SET:ISet, END_START_RL:number, END_START_IM:number, colorPalette: RGBColor[];
let MAX_ITERATION = 100

onmessage = e => {
    const { isSettingUp } = e.data
    if (isSettingUp) {
        const { w, h, realSet, imaginarySet } = e.data
        MAX_ITERATION = e.data.maxIterations
        REAL_SET = { start: realSet.start, end: realSet.end }
        IMAGINARY_SET = { start: imaginarySet.start, end: imaginarySet.end }

        END_START_RL = (REAL_SET.end - REAL_SET.start)
        END_START_IM = (IMAGINARY_SET.end - IMAGINARY_SET.start)

        WIDTH = w
        HEIGHT = h

        colorPalette = e.data.colorPalette;
    } else {

        const { row } = e.data
        const mandelbrotSets = []
        for (let col = 0; col < WIDTH; col++)
                mandelbrotSets[col] = calculate(col, row)

        const canvas = new OffscreenCanvas(WIDTH,1);
        const ctx = canvas.getContext('2d');
        ctx!.canvas.width = WIDTH;
        ctx!.canvas.height = 1;

        for (let i = 0; i < ctx!.canvas.width; i++) {
            const [m, isMandelbrotSet] = mandelbrotSets[i];
            const c = isMandelbrotSet ? {r: 0, g: 0, b: 0} : colorPalette[m % (colorPalette.length - 1)]
            ctx!.fillStyle = `rgb(${c.r}, ${c.g}, ${c.b})`;
            ctx!.fillRect(i, 0, 1, 1)
        }
        const bitmap = canvas.transferToImageBitmap();
        postMessage({ row ,bitmap})
    }
}

const calculate = (i:number, j:number) => mandelbrot(relativePoint(i, j))

const relativePoint = (x:number, y:number) => {
    x = REAL_SET.start + (x / WIDTH) * (END_START_RL)
    y = IMAGINARY_SET.start + (y / HEIGHT) * (END_START_IM)

    return { x, y }
}

const mandelbrot = (c:Coordinates):[number,boolean] => {
    let z:Coordinates = { x: 0, y: 0 }, n = 0;
    do {
        z = {
            x: z.x * z.x - z.y * z.y + c.x,
            y: 2 * z.x * z.y + c.y
        }
        n += 1
    } while (z.x*z.x + z.y*z.y <= 4 && n < MAX_ITERATION)


    return [n, z.x*z.x + z.y*z.y <= 4]
}