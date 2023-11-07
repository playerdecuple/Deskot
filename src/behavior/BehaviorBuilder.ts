import Main from "../../main";
import Deskot from "../Deskot";
import ActionBuilder from "../action/factory/ActionBuilder";
import Environment from "../environment/Environment";
import Coordinate from "../position/Coordinate";
import Script from "../script/Script";
import Nullable from "../type/Nullable";
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
        this.actionName = attributes.action ?? this.name;
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
            const nextAdditive = behaviorList.getAttribute("add") != "false";
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
                case "BehaviourReference":
                case "BehaviorReference":
                case "BehaviourRef":
                case "BehaviorRef":
                case "Behaviour":
                case "Behavior":
                    const nextBehavior = new this(deskot, node, conditions);
                    listArray.push(nextBehavior);
                    break;
            }

        }
    }


    async build(): Promise<BehaviorLike> {
        const action = await ActionBuilder.build(this.deskot, this.actionName, this.params);

        if (action == undefined || action == null) {
            console.warn(`In building ${this.toString()} instance: Failed to build Action(Name: ${this.actionName}) instance.`);
        }

        return new Behavior(this.name, action!!, this.isHidden);
    }


    static async build(deskot: Deskot, name: string) {
        if (deskot.behaviorFactories.has(name)) {
            return await deskot.behaviorFactories.get(name)!.build();
        } else {
            throw new Error(`Behavior not found. (Behavior Name: ${name})`);
        }
    }


    static async buildRandomBehavior(deskot: Deskot, prevName: Nullable<string>): Promise<Nullable<BehaviorLike>> {
        const params: any = {};
        params.deskot = deskot;

        let totalFrequency = 0;
        const filterCandidates = (factory: BehaviorBuilder, params: any) => {
            if (factory.isEffective(params)) {
                totalFrequency += factory.frequency;
                return true;
            }
            return false;
        }

        let candidates: Array<BehaviorBuilder> = [...deskot
            .behaviorFactories
            .values()]
            .filter(factory => filterCandidates(factory, params));

        if (prevName != null) {
            const prevFactory = deskot.behaviorFactories.get(prevName);
            if (!prevFactory?.isNextAdditive) {
                totalFrequency = 0;
                candidates = [];
            }

            const nextCandidates: Array<BehaviorBuilder> = (prevFactory
                ?.nextBehaviorBuilders ?? [])
                .filter(factory => filterCandidates(factory, params));
            candidates.push(...nextCandidates);
        }

        if (!totalFrequency) { // Fall
            const area = Main.config.allowMultiscreen
                ? Environment.screen
                : deskot.environment.getWorkArea()

            deskot.anchor = new Coordinate(
                Math.round(Math.random() * area.right - area.left) + area.left,
                area.top - 256
            );

            const behavior = await BehaviorBuilder.build(deskot, "Fall");
            return behavior;
        }

        let random = Math.random() * totalFrequency;
        for (const factory of candidates) {
            random -= factory.frequency;
            if (random < 0) {
                return await factory.build();
            }
        }

        return null;
    }

}



export default BehaviorBuilder;