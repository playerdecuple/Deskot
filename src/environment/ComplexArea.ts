import Coordinate from "../position/Coordinate";
import Rectangle from "../position/Rectangle";
import Nullable from "../type/Nullable";
import Area from "./Area";
import Floor from "./Floor";
import Wall from "./Wall";



class ComplexArea {

    private areas = new Map<string, Area>();


    set(key: string, value: Rectangle) {
        for (const area of this.areas.values()) {
            if (area.isSameArea(value)) {
                return;
            }
        }

        let area = this.areas.get(key);
        if (area == null) {
            area = new Area();
            this.areas.set(key, area);
        }
        area.set(value);
    }


    retain(ids: Array<string>) {
        for (const k of this.areas.keys()) {
            if (!ids.includes(k)) {
                this.areas.delete(k);
            }
        }
    }


    getBottomBorder(location: Coordinate): Nullable<Floor> {
        let border = null;

        for (const area of this.areas.values()) {
            if (area.bottomBorder.isOn(location)) {
                border = area.bottomBorder;
            }
        }

        for (const area of this.areas.values()) {
            if (area.topBorder.isOn(location)) {
                border = null;
            }
        }

        return border;
    }


    getTopBorder(location: Coordinate): Nullable<Floor> {
        let border = null;

        for (const area of this.areas.values()) {
            if (area.topBorder.isOn(location)) {
                border = area.topBorder;
            }
        }

        for (const area of this.areas.values()) {
            if (area.bottomBorder.isOn(location)) {
                border = null;
            }
        }

        return border;
    }


    getLeftBorder(location: Coordinate): Nullable<Wall> {
        let border = null;
        
        for (const area of this.areas.values()) {
            if (area.leftBorder.isOn(location)) {
                border = area.leftBorder;
            }
        }

        for (const area of this.areas.values()) {
            if (area.rightBorder.isOn(location)) {
                border = null;
            }
        }

        return border;
    }


    getRightBorder(location: Coordinate): Nullable<Wall> {
        let border = null;

        for (const area of this.areas.values()) {
            if (area.rightBorder.isOn(location)) {
                border = area.rightBorder;
            }
        }
        
        for (const area of this.areas.values()) {
            if (area.leftBorder.isOn(location)) {
                border = null;
            }
        }

        return border;
    }


    getAreas(): Array<Area> {
        return [...this.areas.values()];
    }

}


export default ComplexArea;