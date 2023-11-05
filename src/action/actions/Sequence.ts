import Action from "../Action";
import ComplexAction from "../ComplexAction";



class Sequence extends ComplexAction {

    private sequenceCount: number = 1;


    constructor(params: any, actions: Array<Action>) {
        super(params, ...actions);
    }


    override hasNext() {
        this.seek();
        return this.sequenceCount <= this.maximumSequenceCount
            && super.hasNext();
    }

    
    override get currentActionIndex() {
        return super.currentActionIndex;
    }

    override set currentActionIndex(index: number) {
        if (index >= this.actions.length) {
            this.sequenceCount++;
        }

        super.currentActionIndex = this.isLoop 
            ? index % this.actions.length 
            : index;
    }

    
    get isLoop() {
        return super.params?.loop === "true" || super.params?.loop instanceof Number;
    }

    get maximumSequenceCount() {
        if (super.params?.loop instanceof Number) {
            return super.params?.loop;
        }
        return 1;
    }

}


export default Sequence;