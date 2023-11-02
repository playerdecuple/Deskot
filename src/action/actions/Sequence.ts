import Action from "../Action";
import ComplexAction from "../ComplexAction";



class Sequence extends ComplexAction {

    constructor(params: any, actions: Array<Action>) {
        super(params, ...actions);
    }


    override hasNext() {
        this.seek();
        return super.hasNext();
    }

    
    override get currentActionIndex() {
        return super.currentActionIndex;
    }

    override set currentActionIndex(index: number) {
        super.currentActionIndex = this.isLoop 
            ? index % this.actions.length 
            : index;
    }

    
    get isLoop() {
        return super.params?.loop === "true";
    }

}


export default Sequence;