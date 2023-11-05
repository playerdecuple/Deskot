import Main from "../../../main";
import Deskot from "../../Deskot";
import Nullable from "../../type/Nullable";
import Location from "../Location";
import Area from "../Area";
import Border from "../Border";
import Environment from "../Environment";
import FakeBorder from "../FakeBorder";
import GenericEnvironment from "./GenericEnvironment";



class DeskotEnvironment {

    private deskot: Deskot;

    private environment: Environment = new GenericEnvironment();

    public currentWorkArea: Nullable<Area>;


    constructor(deskot: Deskot) {
        this.deskot = deskot;
    }


    get workArea() {
        return this.getWorkArea();
    }

    public getWorkArea(ignoreSettings: boolean = false): Area {
        const { currentWorkArea, environment } = this;
        const { anchor } = this.deskot!!;
        const nextWorkArea = environment.getWorkArea();

        if (currentWorkArea != null) {
            if (ignoreSettings || Main.config.allowMultiscreen === true) {
                if (
                    currentWorkArea.isSameArea(nextWorkArea) && 
                    currentWorkArea.toRectangle().contains(nextWorkArea.toRectangle())
                ) {
                    if (nextWorkArea.contains(anchor.x, anchor.y)) {
                        this.currentWorkArea = nextWorkArea;
                        return this.currentWorkArea;
                    }
                }

                if (currentWorkArea.contains(anchor.x, anchor.y)) {
                    return currentWorkArea;
                }
            } else {
                return currentWorkArea;
            }
        }

        if (nextWorkArea.contains(anchor.x, anchor.y)) {
            this.currentWorkArea = nextWorkArea;
            return this.currentWorkArea;
        }

        for (const area of Environment.getScreens()) {
            if (area.contains(anchor.x, anchor.y)) {
                this.currentWorkArea = area;
                return area;
            }
        }

        this.currentWorkArea = nextWorkArea;
        return this.currentWorkArea;
    }


    get ceiling() {
        return this.ceilingBorder;
    }

    get ceilingBorder() {
        return this.getCeilingBorder();
    }

    public getCeilingBorder(ignoreSep: boolean = false): Border {
        if (this.workArea.topBorder.isOn(this.deskot.anchor)) {
            if (!ignoreSep || this.environment.isScreenTopBottom(this.deskot.anchor)) {
                return this.workArea.topBorder;
            }
        }

        return FakeBorder.instance_;
    }


    get floor() {
        return this.getFloor();
    }

    public getFloor(ignoreSep: boolean = false): Border {
        if (this.workArea.bottomBorder.isOn(this.deskot.anchor)) {
            if (!ignoreSep || this.environment.isScreenTopBottom(this.deskot.anchor)) {
                return this.workArea.bottomBorder;
            }
        }

        return FakeBorder.instance_;
    }


    get wall() {
        return this.getWall();
    }

    public getWall(ignoreSep: boolean = false): Border {
        if (this.deskot.lookRight) {
            if (this.workArea.rightBorder.isOn(this.deskot.anchor)) {
                if (!ignoreSep || this.environment.isScreenLeftRight(this.deskot.anchor)) {
                    return this.workArea.rightBorder;
                }
            }
        } else {
            if (this.workArea.leftBorder.isOn(this.deskot.anchor)) {
                if (!ignoreSep || this.environment.isScreenLeftRight(this.deskot.anchor)) {
                    return this.workArea.leftBorder;
                }
            }
        }

        return FakeBorder.instance_;
    }


    get screen() {
        return Environment.screen;
    }


    get complexScreen() {
        return Environment.complexScreen;
    }


    get cursor(): Location {
        return Environment.cursor;
    }


    refreshWorkArea() {
        this.getWorkArea(true);
    }

}


export default DeskotEnvironment;