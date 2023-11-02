import Coordinate from "./Coordinate";

class Rectangle {

    x: number;

    y: number;

    width: number;

    height: number;


    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }


    toString(): string {
        return `Rectangle(x: ${this.x}, y: ${this.y}, width: ${this.width}, height: ${this.height})`;
    }


    union(rect: Rectangle): Rectangle {
        const x = rect.x < this.x ? rect.x : this.x;
        const y = rect.y < this.y ? rect.y : this.y;
        const width = rect.width > this.width ? rect.width : this.width;
        const height = rect.height > this.height ? rect.height : this.height;

        if (this.x + this.y + this.width + this.height == 0) {
            return {...rect} as Rectangle;
        }

        return new Rectangle(x, y, width, height);
    }


    contains(rect: Rectangle): boolean {
        const rectArray = [
            new Coordinate(rect.x, rect.y),
            new Coordinate(rect.x + rect.width, rect.y),
            new Coordinate(rect.x, rect.y + rect.height),
            new Coordinate(rect.x + rect.width, rect.y + rect.height)
        ];

        return rectArray
            .filter(coord => this.containsCoordinate(coord))
            .length == 4;
    }


    equals(rect: Rectangle): boolean {
        return this.x == rect.x
            && this.y == rect.y
            && this.width == rect.width
            && this.height == rect.height;
    }


    private containsCoordinate(coord: Coordinate): boolean {
        const { x, y } = coord;

        return (this.x <= x && x <= this.x + this.width)
            && (this.y <= y && y <= this.y + this.height);
    }

}


export default Rectangle;