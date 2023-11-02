import Coordinate from "../position/Coordinate";


class Location extends Coordinate {

    public dx: number = 0;

    public dy: number = 0;


    constructor(x: number = 0, y: number = 0) {
        super(x, y);
    }


    set(value: Coordinate) {
        this.dx = (this.dx + value.x - super.x) / 2;
        this.dy = (this.dy + value.y - super.y) / 2;

        super.x = value.x;
        super.y = value.y;
    }

}


export default Location;