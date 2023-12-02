export class Point {
    constructor(public x: number, public y: number) {}
}

export class Square {
    constructor(
        public topLeft: Point,
        public topRight: Point,
        public bottomRight: Point,
        public bottomLeft: Point
    ) {}

    translate(dx: number, dy: number): void {
        const matrix = [
            [1, 0, 0],
            [0, 1, 0],
            [dx, dy, 1],
        ];
        this.applyMatrix(matrix);
    }

    scale(sx: number, sy: number): void {
        const centerX = (this.topLeft.x + this.bottomRight.x) / 2;
        const centerY = (this.topLeft.y + this.bottomRight.y) / 2;
        this.translate(-centerX,-centerY);
        const matrix=[
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, 1],
        ];
        this.applyMatrix(matrix);
        this.translate(centerX,centerY);
    }

    rotate(degree: number): void {
        const angle = degree * (Math.PI/180);
        const centerX = (this.topLeft.x + this.bottomRight.x) / 2;
        const centerY = (this.topLeft.y + this.bottomRight.y) / 2;

        const matrix = [
            [Math.cos(angle), Math.sin(angle),0],
            [-Math.sin(angle), Math.cos(angle),0],
            [-centerX*Math.cos(angle)+centerY*Math.sin(angle)+centerX,-centerX*Math.sin(angle)-centerY*Math.cos(angle)+centerY,1]
        ];
        this.applyMatrix(matrix);
    }
    applyMatrix(matrix:number[][]){
        this.topLeft = this.multiplyMatrix([[this.topLeft.x,this.topLeft.y,1]],matrix);
        this.topRight = this.multiplyMatrix([[this.topRight.x,this.topRight.y,1]],matrix);
        this.bottomRight = this.multiplyMatrix([[this.bottomRight.x,this.bottomRight.y,1]],matrix);
        this.bottomLeft = this.multiplyMatrix([[this.bottomLeft.x,this.bottomLeft.y,1]],matrix);
    }
    multiplyMatrix(a:number[][],b:number[][]):Point{
        if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
            throw new Error('arguments should be in 2-dimensional array format');
        }
        const x = a.length,
            z = a[0].length,
            y = b[0].length;
        if (b.length !== z) {
            // XxZ & ZxY => XxY
            throw new Error('number of columns in the first matrix should be the same as the number of rows in the second');
        }
        const productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
        const product = new Array(x);
        for (let p = 0; p < x; p++) {
            product[p] = productRow.slice();
        }
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                for (let k = 0; k < z; k++) {
                    product[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return new Point(product[0][0],product[0][1]);
    }

}