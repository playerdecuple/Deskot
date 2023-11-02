import Animation from "../../animation/Animation";
import Coordinate from "../../position/Coordinate";
import BorderedAction from "../BorderedAction";



class Move extends BorderedAction {

    private defaultTargetX: number = Infinity;

    private defaultTargetY: number = Infinity;


    constructor(animations: Array<Animation>, params: any) {
        super(animations, params);
    }


    override hasNext(): boolean {
        const { targetX, targetY } = this;
        const deskot = this.deskot!!;

        let noMoveX = false;
        let noMoveY = false;

        if (targetX != -Infinity) {
            if (deskot.anchor.x == targetX) {
                noMoveX = true;
            }
        }
        
        if (targetY != -Infinity) {
            if (deskot.anchor.y == targetY) {
                noMoveY = true;
            }
        }

        return super.hasNext() && !noMoveX && !noMoveY;
    }


    override tick() {
        super.tick();

        if (this.border != null && !this.border.isOn(this.deskot!.anchor)) {
            throw new Error("Lost ground!");
        }

        const { targetX, targetY } = this;
        const deskot = this.deskot!!;
        let down = false;

        if (targetX != this.defaultTargetX) {
            if (deskot.anchor.x != targetX) {
                deskot.lookRight = deskot.anchor.x < targetX;
            }
        }

        if (targetY != this.defaultTargetY) {
            down = deskot.anchor.y < targetY;
        }

        this.animation?.next(deskot, this.time);

        if (
            (deskot.lookRight && deskot.anchor.x >= targetX) ||
            (!deskot.lookRight && deskot.anchor.x <= targetX)
        ) {
            deskot.anchor = new Coordinate(targetX, deskot.anchor.y);
        }

        if (
            (down && deskot.anchor.y >= targetY) ||
            (!down && deskot.anchor.y <= targetY)
        ) {
            deskot.anchor = new Coordinate(deskot.anchor.x, targetY);
        }
    }


    get targetX() {
        return this.params?.targetX ?? this.defaultTargetX;
    }

    get targetY() {
        return this.params?.targetY ?? this.defaultTargetY;
    }

}


export default Move;