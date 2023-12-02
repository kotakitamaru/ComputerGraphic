import {Coordinates, ISet, RGBColor} from "./types.ts";


let WIDTH:number, HEIGHT:number, REAL_SET:ISet, IMAGINARY_SET:ISet, END_START_RL:number, END_START_IM:number, c:Coordinates, colorPalette: RGBColor[]
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

        c = e.data.c
        WIDTH = w
        HEIGHT = h

        colorPalette = e.data.colorPalette;
    } else {
        const { row } = e.data
        const juliaSets = []
        for (let col = 0; col < WIDTH; col++)
            juliaSets[col] = calculate(col, row)
        const canvas = new OffscreenCanvas(WIDTH,1);
        const ctx = canvas.getContext('2d');
        ctx!.canvas.width = WIDTH;
        ctx!.canvas.height = 1;

        for (let i = 0; i < ctx!.canvas.width; i++) {
            const [m, isMandelbrotSet] = juliaSets[i];
            const c = isMandelbrotSet ? {r: 0, g: 0, b: 0} : colorPalette[m % (colorPalette.length - 1)]
            ctx!.fillStyle = `rgb(${c.r}, ${c.g}, ${c.b})`;
            ctx!.fillRect(i, 0, 1, 1)
        }
        const bitmap = canvas.transferToImageBitmap();
        console.log("Ended work")
        postMessage({ row ,bitmap})
    }
}

const calculate = (i:number, j:number) => julia(relativePoint(i, j))

const relativePoint = (x:number, y:number) => {
    x = REAL_SET.start + (x / WIDTH) * (END_START_RL)
    y = IMAGINARY_SET.start + (y / HEIGHT) * (END_START_IM)

    return { x, y }
}

const julia = (z:Coordinates):[number,boolean] => {
    let n = 0, d;
    do {
        z = {
            x: z.x*z.x - z.y*z.y + c.x,
            y: 2 * z.x * z.y + c.y
        }
        d = 0.5 * (z.x*z.x + z.y*z.y)
        n += 1
    } while (d <= 2 && n < MAX_ITERATION)

    return [n, d <= 2]
}