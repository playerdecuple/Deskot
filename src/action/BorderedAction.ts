import Deskot from "../Deskot";
import Animation from "../animation/Animation";
import Border from "../environment/Border";
import Nullable from "../type/Nullable";
import Action from "./Action";



class BorderedAction extends Action {

    private defaultBorderType: Nullable<string> = null;

    protected border: Nullable<Border>;


    constructor(animations: Array<Animation>, params: any) {
        super(animations, params);
    }


    override init(deskot: Deskot) {
        super.init(deskot);

        const borderType = this.params!.border ?? this.defaultBorderType;

        if (borderType == "ceiling") {
            this.border = deskot.environment.ceilingBorder;
        } else if (borderType == "wall") {
            this.border = deskot.environment.wall;
        } else if (borderType == "floor") {
            this.border = deskot.environment.floor;
        }
    }


    override tick() {
        if (this.border != null) {
            const deskot = this.deskot!!;
            deskot.anchor = this.border.move(deskot.anchor);
        }
    }

}


export default BorderedAction;