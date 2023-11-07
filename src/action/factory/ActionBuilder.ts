import Deskot from "../../Deskot";
import AnimationBuilder from "../../animation/AnimationBuilder";
import Animation from "../../animation/Animation";
import LateInit from "../../type/Lateinit";
import DomUtil from "../../utils/DomUtil";
import Action from "../Action";
import Stay from "../actions/Stay";
import ActionFactoryLike from "./ActionFactoryLike";
import ActionRef from "./ActionRef";
import Move from "../actions/Move";
import Sequence from "../actions/Sequence";
import Select from "../actions/Select";
import Animate from "../actions/Animate";



class ActionBuilder implements ActionFactoryLike {

    private readonly childrenAction: Array<ActionFactoryLike> = [];

    private readonly animations: Array<any> = [];

    
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
        this.attr = DomUtil.parseAttributes(deskot, this.attr);

        this.initChildren();

        if (this.name.length) {
            deskot.actionFactories.set(this.name, this);
        }
    }


    private initChildren() {
        for (const childNode of this.node.children) {
            if (childNode.tagName == "Action") {

                const childFactory = new ActionBuilder(this.deskot, childNode);
                this.childrenAction.push(childFactory);

            } else if (childNode.tagName == "ActionReference") {

                const ref = new ActionRef(this.deskot, childNode);
                this.childrenAction.push(ref);

            } else if (childNode.tagName == "Animation") {

                const animation = new AnimationBuilder(this.deskot, childNode);
                this.animations.push(animation);

            }
        }
    }


    async createActions(): Promise<Array<Action>> {
        const actionPromises = this.childrenAction.map(factory => factory.build({}));
        const actions = await Promise.all(actionPromises);

        return actions;
    }


    async createAnimations(): Promise<Array<Animation>> {
        const animPromises = this.animations.map(factory => {
            return factory.build();
        });
        const animations = await Promise.all(animPromises);
        return animations;
    }


    async build(attr: any = {}): Promise<Action> {
        let action: LateInit<Action>;
        attr = DomUtil.parseAttributes(this.deskot, attr);
        attr = { ...attr, ...this.attr };

        const loadPromises = await Promise.all([
            this.createActions(),
            this.createAnimations()
        ]);
        const childrenAction = loadPromises[0] as Array<Action>;
        const animations = loadPromises[1] as Array<Animation>;
        
        if (this.type == "embedded") {
            try {
                const modulePath = this.attr?.class;
                const actionClass = await import("." + modulePath + ".js");
                
                action = new actionClass.default(animations, attr);

                if (action?.validate() !== true) {
                    throw new Error();
                }
            } catch (e) {
                console.error(e);
                throw new Error(`An error occurred importing embedded module. (Required module file path: ${this.attr?.class})`);
            }
        } else if (this.type == "stay") {
            return new Stay(animations, attr);
        } else if (this.type == "move") {
            return new Move(animations, attr);
        } else if (this.type == "animate") {
            return new Animate(animations, attr);
        } else if (this.type == "sequence") {
            return new Sequence(attr, childrenAction);
        } else if (this.type == "select") {
            return new Select(attr, childrenAction);
        }

        return action!!;
    }

    
    static async build(deskot: Deskot, name: string, params: any): Promise<Action> {
        try {
            const instance = deskot.actionFactories.get(name)!;
            return await instance!.build({ ...params });
        } catch (e) {
            console.error(e);
            throw new Error(`Failed to build Action instance. Action Name: ${name}`);
        }
    }

    
    toString(): string {
        return `Action(DeskotInstanceName: ${this.deskot.name}, Name: ${this.name}, Type: ${this.type})`;
    }

}


export default ActionBuilder;