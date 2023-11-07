import Coordinate from "../position/Coordinate";
import Rectangle from "../position/Rectangle";
import Floor from "./Floor";
import Wall from "./Wall";



class Area {

    public isVisible = true;

    
    public left: number = 0;

    public right: number = 0;

    public top: number = 0;

    public bottom: number = 0;


    public dLeft: number = 0;

    public dRight: number = 0;

    public dTop: number = 0;

    public dBottom: number = 0;


    public readonly leftBorder: Wall = new Wall(this, false);

    public readonly rightBorder: Wall = new Wall(this, true);

    public readonly topBorder: Floor = new Floor(this, false);

    public readonly bottomBorder: Floor = new Floor(this, true);


    get floor() {
        return this.bottomBorder;
    }



    set(rect: Rectangle) {
        this.dLeft = rect.x - this.left;
        this.dRight = rect.x + rect.width - this.right;
        this.dTop = rect.y - this.top;
        this.dBottom = rect.y + rect.height - this.bottom;

        this.left = rect.x;
        this.right = rect.x + rect.width;
        this.top = rect.y;
        this.bottom = rect.y + rect.height;
    }


    containsCoordinate(location: Coordinate): boolean {
        return this.contains(location.x, location.y);
    }


    contains(x: number, y: number): boolean {
        return (this.left <= x && x <= this.right)
            && (this.top <= y && y <= this.bottom);
    }


    toString() {
        return `Area(Left: ${this.left}, Right: ${this.right}, Top: ${this.top}, Bottom: ${this.bottom})`;
    }

    toRectangle(): Rectangle {
        return new Rectangle(this.left, this.top, this.right - this.left, this.bottom - this.top);
    }


    getWidth() {
        return this.right - this.left;
    }

    getHeight() {
        return this.bottom - this.top;
    }

    
    get width() {
        return this.getWidth();
    }

    get height() {
        return this.getHeight();
    }

    
    isSameArea(rect: Rectangle | Area) {
        if (rect instanceof Area) {
            rect = rect.toRectangle();
        }

        return this.left == rect.x
            && this.right == rect.x + rect.width
            && this.top == rect.y
            && this.bottom == rect.y + rect.height;
    }

}


export default Area;