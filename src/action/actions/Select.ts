import Action from "../Action";
import ComplexAction from "../ComplexAction";



class Select extends ComplexAction {

    constructor(params: any, actions: Array<Action>) {
        super(params, ...actions);
    }

}



export default Select;