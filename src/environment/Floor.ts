import Coordinate from "../position/Coordinate";
import Area from "./Area";
import Border from "./Border";



class Floor implements Border {

    private area: Area

    public isBottom: boolean;


    constructor(area: Area, bottom: boolean) {
        this.area = area;
        this.isBottom = bottom;
    }


    getY() {
        return this.isBottom ? this.area.bottom : this.area.top;
    }

    getDY() {
        return this.isBottom ? this.area.dBottom : this.area.dTop;
    }


    isOn(location: Coordinate): boolean {
        return this.area.isVisible &&
            (this.getY() == location.y) &&
            (this.area.left <= location.x) &&
            (location.x <= this.area.right);
    }


    move(location: Coordinate): Coordinate {
        const { isVisible, left, dLeft, right, dRight } = this.area;
        
        if (!isVisible) {
            return location;
        }

        const d = right - dRight - (left - dLeft);
        if (!d) {
            return location;
        }

        const nextX = (location.x - (left - dLeft)) * ((right - left) / d) + left;
        const nextLoc = new Coordinate(nextX, location.y + this.getDY());

        if (
            Math.abs(nextLoc.x - location.x) >= 80 ||
            nextLoc.x - location.x > 20 ||
            nextLoc.x - location.x < -80
        ) {
            return location;
        }

        return nextLoc;
    }

}


export default Floor;