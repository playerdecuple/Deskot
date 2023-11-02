import Deskot from "../Deskot";
import Action from "./Action";



class ComplexAction extends Action {
    
    protected actions: Array<Action>;

    protected _currentActionIndex: number = 0;


    constructor(params: any, ...actions: Array<Action>) {
        super([], params);

        if (actions.length == 0) {
            throw new Error("Empty Sequence Action.");
        }
        
        this.actions = actions;
        this._currentActionIndex = 0;
    }

    
    override init(deskot: Deskot) {
        super.init(deskot);

        if (super.hasNext()) {
            this.currentActionIndex = 0;
            this.seek();
        }
    }


    protected seek() {
        if (super.hasNext()) {
            while (this.currentActionIndex < this.actions.length) {
                if (this.currentAction.hasNext()) {
                    break;
                }
                this.currentActionIndex++;
            }
        }
    }


    override hasNext(): boolean {
        const inRange = this.currentActionIndex < this.actions.length;

        return super.hasNext() 
            && inRange 
            && this.currentAction.hasNext();
    }


    protected override tick() {
        if (this.currentAction.hasNext()) {
            this.currentAction.next();
        }
    }


    override isDraggable(): boolean {
        if (
            this.currentActionIndex < this.actions.length &&
            this.actions[this.currentActionIndex] instanceof Action    
        ) {
            return this.actions[this.currentActionIndex].isDraggable();
        }

        return true;
    }


    get currentAction() {
        return this.actions[this.currentActionIndex];
    }

    get currentActionIndex() {
        return this._currentActionIndex;
    }

    set currentActionIndex(index: number) {
        this._currentActionIndex = index;
        if (super.hasNext()) {
            if (this.currentActionIndex < this.actions.length) {
                this.currentAction.init(this.deskot!!);
            }
        }
    }
    
}



export default ComplexAction;