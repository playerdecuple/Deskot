import Deskot from "../Deskot";
import ActionBuilder from "../action/factory/ActionBuilder";
import Script from "../script/Script";
import DomUtil from "../utils/DomUtil";
import Behavior from "./Behavior";
import BehaviorLike from "./BehaviorLike";



class BehaviorBuilder {

    readonly deskot: Deskot;

    readonly node: Element;
    
    readonly name: string;

    readonly actionName: string;

    readonly frequency: number;

    readonly conditions: Array<string>;

    readonly isHidden: boolean;

    readonly isNextAdditive: boolean;


    readonly nextBehaviorBuilders: Array<BehaviorBuilder> = [];

    readonly params: any = {};


    constructor(deskot: Deskot, node: Element, conditions: Array<string>) {
        this.deskot = deskot;
        this.node = node;
        this.conditions = conditions;

        const attributes = DomUtil.getAttributes(node);
        this.name = attributes.name;
        this.actionName = attributes.actionName;
        this.frequency = Number(attributes.frequency);
        this.isHidden = attributes.hidden == "true";

        if (attributes?.condition != null) {
            this.conditions.push(attributes.condition);
        }

        delete attributes.name;
        delete attributes.actionName;
        delete attributes.frequency;
        delete attributes.condition;
        delete attributes.hidden;
        this.params = { ...attributes };

        let isNextAdditive = true;
        for (const behaviorList of node.querySelectorAll("NextBehavior")) {
            const nextAdditive = behaviorList.getAttribute("add") == "true";
            isNextAdditive = nextAdditive;

            this.loadNextBuilder(behaviorList, []);
        }
        this.isNextAdditive = isNextAdditive;
    }


    toString(): string {
        return `Behavior(DeskotInstanceName: ${this.deskot.name}, Name: ${this.name}, Frequency: ${this.frequency}, ActionName: ${this.actionName})`;
    }


    isEffective(params: any): boolean {
        if (this.frequency === 0) return false;

        for (const condition of this.conditions) {
            if (!new Script(this.deskot, condition, false).get(params)) {
                return false;
            }
        }

        return true;
    }


    loadNextBuilder(listNode: Element, conditions: Array<string>) {
        BehaviorBuilder.loadNextBuilder(this.deskot, this.nextBehaviorBuilders, listNode, conditions);
    }

    
    static loadNextBuilder(deskot: Deskot, listArray: Array<BehaviorBuilder>, listNode: Element, conditions: Array<string>) {
        for (const node of listNode.children) {

            switch (node.tagName) {
                case "Condition":
                    const nextConditions = [ ...conditions ];
                    nextConditions.push(node.getAttribute("condition")!!);

                    this.loadNextBuilder(deskot, listArray, node, nextConditions);
                    break;
                case "BehaviorReference":
                case "BehaviorRef":
                case "Behavior":
                    const nextBehavior = new this(deskot, node, conditions);
                    listArray.push(nextBehavior);
                    break;
            }

        }
    }


    async build(): Promise<BehaviorLike> {
        const action = await ActionBuilder.build(this.deskot, this.actionName, this.params);
        return new Behavior(this.name, action, this.isHidden);
    }

}



export default BehaviorBuilder;