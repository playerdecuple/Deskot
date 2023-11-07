import Deskot from "../../Deskot";
import DomUtil from "../../utils/DomUtil";
import Action from "../Action";
import ActionFactoryLike from "./ActionFactoryLike";


class ActionRef implements ActionFactoryLike {

    private readonly deskot: Deskot;

    private readonly node: Element;

    private readonly name: string;

    readonly attr: any;


    constructor(deskot: Deskot, refNode: Element) {
        this.deskot = deskot;
        this.node = refNode;
        this.name = refNode.getAttribute("name")!!;
        this.attr = DomUtil.getAttributes(refNode);
    }


    async build(params: any): Promise<Action> {
        if (!this.deskot.actionFactories.has(this.name)) {
            throw new Error("Action not found.");
        }
        
        const actionFactory = this.deskot.actionFactories.get(this.name);
        return await actionFactory!.build({...this.attr, ...params});
    }

    
    toString(): string {
        return `ActionReference(DeskotInstanceName: ${this.deskot.name}, Name: ${this.name})`;
    }

}


export default ActionRef;