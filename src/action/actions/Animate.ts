import Animation from "../../animation/Animation";
import BorderedAction from "../BorderedAction";



class Animate extends BorderedAction {

    constructor(animations: Array<Animation>, params: any) {
        super(animations, params);
    }


    override tick() {
        super.tick();

        if (this.border != null && !this.border.isOn(this.deskot!.anchor)) {
            throw new Error("Lost ground!");
        }

        this.animation?.next(this.deskot!!, this.time);
    }


    override hasNext() {
        const inTime = this.time < (this.animation?.getDuration() ?? Infinity);
        return super.hasNext() && inTime;
    }

}


export default Animate;