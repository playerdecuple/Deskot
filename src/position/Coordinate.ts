class Coordinate {

    public x: number;

    public y: number;


    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString(): string {
        return `Coordinate(x: ${this.x}, y: ${this.y})`;
    }

}


export default Coordinate;