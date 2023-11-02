import Deskot from "../Deskot";
import Action from "./Action";



abstract class InstantAction extends Action {

    constructor(params: any) {
        super([], params);
    }


    override init(deskot: Deskot) {
        super.init(deskot);

        if (super.hasNext()) {
            this.apply();
        }
    }


    abstract apply(): void;


    override hasNext(): boolean {
        return false;
    }


    protected override tick() {
        // Memento mori, the Deskot instance.
    }

}


export default InstantAction;