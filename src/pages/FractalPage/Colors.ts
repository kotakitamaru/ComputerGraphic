import {RGBColor} from "./types.ts";

export function firePalette():RGBColor[]{
    const colors: RGBColor[] = []

    const slice = Math.floor(255/4);
    for(let i = 0; i < slice; i++)
    {
        colors.push({r:(255/slice)*i,g:0,b:0})
    }
    for(let i = slice; i < slice*2; i++)
    {
        colors.push({r:255,g:(255/slice)*(i-slice),b:0})
    }
    for(let i = slice*2; i < 255; i++)
    {
        colors.push({r:255,g:255,b:(255/slice)*(i-slice*2)})
    }
    for(let i = slice*3; i < 255; i++)
    {
        colors.push({r:interpolation(255,0,i-slice*3,slice),
            g:interpolation(255,0,i-slice*3,slice),
            b:interpolation(255,0,i-slice*3,slice)})
    }

    return colors;
}

export function rainbowPalette():RGBColor[]{
    const colors:RGBColor[] = [];
    const colorNumber = 210;
    const slice = Math.floor(colorNumber/6);
    const colorShades =  Math.floor(255/slice);

    for(let i = 0; i < slice; i++) {  //Red to Yellow
        colors.push({r:255,g:i*colorShades,b:0})
    }
    for(let i = slice; i < slice*2; i++) { // Yellow to Green
        colors.push({r:255-((i-slice)*colorShades),g:255,b:0})
    }
    for(let i = slice*2; i < slice*3; i++) { // Green to Cyan
        colors.push({r:0,g:255,b:(i-slice*2)*colorShades})
    }
    for(let i = slice*3; i < slice*4; i++) { // Cyan to Blue
        colors.push({r:0,g:255-((i-slice*3)*colorShades),b:255})
    }
    for(let i = slice*4; i < slice*5; i++) { // Blue to Purple
        colors.push({r:(i-slice*4)*colorShades,g:0,b:255})
    }
    for(let i = slice*5; i < slice*6; i++) { // purple to red
        colors.push({r:255,g:0,b:255-((i-slice*5)*colorShades)})
    }

    return colors;
}

export function pasteleRainbowPalette():RGBColor[]{
    const colors:RGBColor[] = [];
    const colorNumber = 50;
    const slice = Math.floor(colorNumber/5);

    for(let i = 0; i < slice; i++){
        colors.push({r:255,
            g:interpolation(179,223,i,slice),
            b:186})
    }
    for(let i = slice; i < slice*2; i++){
        colors.push({r:255,
            g:interpolation(223,255,i-slice,slice),
            b:186})
    }
    for(let i = slice*2; i < slice*3; i++){
        colors.push({r:interpolation(255,186,i-slice*2,slice),
            g:255,
            b:interpolation(186,201,i-slice*2,slice)})
    }
    for(let i = slice*3; i < slice*4; i++){
        colors.push({r:186,
            g:interpolation(255,225,i-slice*3,slice),
            b:interpolation(201,255,i-slice*3,slice)})
    }
    for(let i = slice*4; i < slice*5; i++){
        colors.push({r:interpolation(186,255,i-slice*4,slice),
            g:interpolation(225,179,i-slice*4,slice),
            b:interpolation(255,186,i-slice*4,slice)})
    }

    return colors;
}

export function blueYellowPalette(){
    const colors:RGBColor[] = [];
    const colorNumber = 100;
    const slice = Math.floor(colorNumber/5);

    for(let i = 0; i < slice; i++){
        colors.push({r:interpolation(0,32,i,slice),
            g:interpolation(7,107,i,slice),
            b:interpolation(100,203,i,slice)})
    }
    for(let i = slice; i < slice*2; i++){
        colors.push({r:interpolation(32,237,i-slice,slice),
            g:interpolation(107,255,i-slice,slice),
            b:interpolation(203,255,i-slice,slice)})
    }
    for(let i = slice*2; i < slice*3; i++){
        colors.push({r:interpolation(237,255,i-slice*2,slice),
            g:interpolation(255,170,i-slice*2,slice),
            b:interpolation(255,0,i-slice*2,slice)})
    }
    for(let i = slice*3; i < slice*4; i++){
        colors.push({r:interpolation(255,0,i-slice*3,slice),
            g:interpolation(170,2,i-slice*3,slice),
            b:0})
    }
    for(let i = slice*4; i < slice*5; i++){
        colors.push({r:0,
            g:interpolation(2,7,i-slice*4,slice),
            b:interpolation(0,100,i-slice*4,slice)})
    }

    return colors;
}

function interpolation(start:number,end:number,index:number,number:number){
    const step = Math.floor((end - start) / number);
    return start+step*index;
}