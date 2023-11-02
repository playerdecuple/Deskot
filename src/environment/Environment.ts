import { screen } from "electron";

import Rectangle from "../position/Rectangle";
import Area from "./Area";
import Location from "./Location";
import Coordinate from "../position/Coordinate";
import ComplexArea from "./ComplexArea";


abstract class Environment {

    public static screenRect: Rectangle = new Rectangle(0, 0, 0, 0);

    public static screenRects: Map<string, Rectangle> = new Map();


    public static screen: Area = new Area();

    public static complexScreen: ComplexArea = new ComplexArea();


    public static cursor: Location = new Location();

    public origin = Environment;

    
    public abstract getWorkArea(): Area;

    // TODO: Get active Chrome, Chromium Browser

    // TODO: Restore Chrome, Chromium Browser

    protected abstract refreshCache(): void;


    private static clock: NodeJS.Timeout;



    start() {
        Environment.clock = setInterval(() => {
            Environment.tick();
        }, 5000);
    }



    protected constructor() {
        Environment.tick();
    }


    static updateScreenRect() {
        let tempBound = new Rectangle(0, 0, 0, 0);
        const screenRects = new Map<string, Rectangle>();

        const screens = screen.getAllDisplays();

        for (const screen of screens) {
            const boundRect = {...screen.bounds} as Rectangle;
            tempBound = tempBound.union(boundRect);
            screenRects.set(screen.id.toString(), boundRect);
        }

        Environment.screenRects = screenRects;
        Environment.screenRect = tempBound;
    }

    
    static tick() {
        this.updateScreenRect();
        this.screen.set(Environment.screenRect);
        
        for (const [ id, rect ] of Environment.screenRects.entries()) {
            this.complexScreen.set(id, rect);
        }

        this.cursor.set(this.getCursorPosition());
    }


    static getCursorPosition(): Coordinate {
        const coord = screen.getCursorScreenPoint();
        return coord as Coordinate;
    }

    
    static getScreens(): Array<Area> {
        return this.complexScreen.getAreas();
    }


    isScreenLeftRight(coord: Coordinate) {
        const count = Environment
            .complexScreen
            .getAreas()
            .filter(area => area.leftBorder.isOn(coord) || area.rightBorder.isOn(coord))
            .length;
        
        if (!count) {
            if (this.getWorkArea().leftBorder.isOn(coord) || this.getWorkArea().rightBorder.isOn(coord)) {
                return true;
            }
        }

        return count == 1;
    }


    isScreenTopBottom(coord: Coordinate) {
        const count = Environment
            .complexScreen
            .getAreas()
            .filter(area => area.topBorder.isOn(coord) || area.rightBorder.isOn(coord))
            .length;

        if (!count) {
            if (this.getWorkArea().topBorder.isOn(coord) || this.getWorkArea().bottomBorder.isOn(coord)) {
                return true;
            }
        }

        return count == 1;
    }

}



export default Environment;