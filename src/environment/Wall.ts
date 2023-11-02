import Coordinate from "../position/Coordinate";
import Area from "./Area";
import Border from "./Border";



class Wall implements Border {
    
    private area: Area;

    public isRight: boolean;


    constructor(area: Area, right: boolean) {
        this.area = area;
        this.isRight = right;
    }


    getX() {
        return this.isRight ? this.area.right : this.area.left;
    }

    getDX() {
        return this.isRight ? this.area.dRight : this.area.dLeft;
    }


    isOn(location: Coordinate): boolean {
        return this.area.isVisible &&
            (this.getX() == location.x) &&
            (this.area.top <= location.y) &&
            (location.y <= this.area.bottom);
    }
    

    move(location: Coordinate): Coordinate {
        const { isVisible, bottom, dBottom, top, dTop } = this.area;

        if (!isVisible) {
            return location;
        }

        const d = bottom - dBottom - (top - dTop);
        if (!d) {
            return location;
        }

        const nextY = (location.y - (top - dTop)) * (bottom - top) / d + top;
        const nextLoc = new Coordinate(location.x + this.getDX(), nextY);

        if (Math.abs(nextLoc.x - location.x) >= 80 || Math.abs(nextLoc.y - location.y) >= 80) {
            return location;
        }

        return nextLoc;
    }


}



export default Wall;