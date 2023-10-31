import Deskot from "../Deskot";
import Action from "../action/Action";
import LateInit from "../type/Lateinit";
import BehaviorLike from "./BehaviorLike";



class Behavior implements BehaviorLike {


    readonly name: string;

    readonly action: Action;

    readonly isHidden: boolean;


    private deskot: LateInit<Deskot>;


    constructor(name: string, action: Action, isHidden: boolean) {
        this.name = name;
        this.action = action;
        this.isHidden = isHidden;
    }


    async init(deskot: Deskot) {
        this.deskot = deskot;
        this.action.init(deskot);

        if (!this.action.hasNext()) {
            const behavior = await deskot.behaviorFactories.get(this.name)!!.build();
            deskot.setBehavior(behavior!!);
        }
    }


    next() {
        if (this.action.hasNext()) {
            this.action.next();
        }

        // TODO: Next Behaviors
    }


    onMousePressed(e: MouseEvent): void {
        console.log(e);
    }


    onMouseReleased(e: MouseEvent): void {
        console.log(e);
    }



    toString(): string {
        return `Behavior(DeskotInstanceName: ${this.deskot?.name}, Name: ${this.name}, Action: ${this.action.toString()})`;
    }


}



export default Behavior;