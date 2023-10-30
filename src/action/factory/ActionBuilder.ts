import Deskot from "../../Deskot";
import AnimationBuilder from "../../animation/AnimationBuilder";
import LateInit from "../../type/Lateinit";
import DomUtil from "../../utils/DomUtil";
import Action from "../Action";
import ActionFactoryLike from "./ActionFactoryLike";
import ActionRef from "./ActionRef";


class ActionBuilder implements ActionFactoryLike {

    private readonly childrenAction: Array<ActionFactoryLike> = [];

    private readonly animations: Array<any> = [];

    // TODO: Children Animation

    
    private readonly deskot: Deskot;

    private readonly node: Element;


    readonly name: string;

    readonly type: string;

    readonly attr: any;


    constructor(deskot: Deskot, actionNode: Element) {
        this.deskot = deskot;
        this.node = actionNode;

        this.name = actionNode.getAttribute("name") ?? "";
        this.type = actionNode.getAttribute("type") ?? "";
        this.attr = DomUtil.getAttributes(actionNode);

        this.initChildren();
    }


    private initChildren() {
        for (const childNode of this.node.children) {
            if (childNode.tagName == "Action") {

                const childFactory = new ActionBuilder(this.deskot, childNode);
                this.childrenAction.push(childFactory);

            } else if (childNode.tagName == "ActionReference") {

                const actionName = childNode.getAttribute("name")!!;

                if (!this.deskot.actionFactories.has(actionName)) {
                    throw new Error("Action not found.");
                }

                const ref = new ActionRef(this.deskot, childNode);
                this.childrenAction.push(ref);

            } else if (childNode.tagName == "Animation") {

                const animation = new AnimationBuilder(this.deskot, childNode);
                this.animations.push(animation);

            }
        }
    }


    async build(attr: any = this.attr): Promise<Action> {
        let action: LateInit<Action>;

        const childrenAction = await this.createActions();
        const animations = await this.createAnimations();
        
        if (this.type == "embedded") {
            try {
                const modulePath = this.attr?.class;

                const actionClass = await import(modulePath);
                action = Object.create(actionClass.prototype);

                action!!.constructor.apply(action, [
                    animations, attr
                ]);
            } catch (e) {
                throw new Error("Class not found.");
            }
        }

        // TODO: Stand, Move, Animate, Sequence, Select

        return action!!;
    }


    async createActions(): Promise<Array<Action>> {
        const actionPromises = this.childrenAction.map(factory => factory.build({}));
        const actions = Promise.all(actionPromises);

        return await actions;
    }


    async createAnimations(): Promise<Array<Animation>> {
        const animPromises = this.animations.map(factory => factory.build());
        const animations = await Promise.all(animPromises);
        return animations;
    }

    
    toString(): string {
        return `Action(DeskotInstanceName: ${this.deskot.name}, Name: ${this.name}, Type: ${this.type})`;
    }

}


export default ActionBuilder;