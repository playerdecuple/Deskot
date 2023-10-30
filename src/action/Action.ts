import Deskot from "../Deskot";
import LateInit from "../type/Lateinit";


abstract class Action {
    
    private deskot: LateInit<Deskot>;

    private animations: Array<any>;

    private param: any;

    
    // TODO: Change type of 'animations' local variable.
    constructor(animations: Array<any> = [], param: any = {}) {
        this.animations = animations;
        this.param = param;
    }


    init(deskot: Deskot) {
        this.deskot = deskot;
    }

}


export default Action;