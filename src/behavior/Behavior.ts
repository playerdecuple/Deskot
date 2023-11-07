import Main from "../../main";
import Deskot from "../Deskot";
import Action from "../action/Action";
import Coordinate from "../position/Coordinate";
import LateInit from "../type/Lateinit";
import BehaviorBuilder from "./BehaviorBuilder";
import BehaviorLike from "./BehaviorLike";



class Behavior implements BehaviorLike {


    readonly name: string;

    readonly action: Action;

    readonly isHidden: boolean;


    private deskot: LateInit<Deskot>;


    constructor(name: string, action: Action, isHidden: boolean) {
        this.name = name;
        this.action = action;
        this.isHidden = isHidden;
    }


    async init(deskot: Deskot) {
        this.deskot = deskot;
        this.action.init(deskot);

        if (!this.action.hasNext()) {
            const behavior = await BehaviorBuilder.buildRandomBehavior(deskot, this.name);
            deskot.setBehavior(behavior!);
        }
    }


    async next() {
        const deskot = this.deskot!
        const bounds = deskot.getBounds();
        const screen = deskot.environment.screen;

        if (this.action.hasNext()) {
            this.action.next();

            if (
                bounds.x + bounds.width <= screen.left ||
                screen.right <= bounds.x ||
                screen.bottom <= bounds.y
            ) {
                deskot.log(`Out of screen bounds! In Behavior: ${this.toString()}`);

                if (Main.config.allowMultiscreen === true) {
                    deskot.anchor = new Coordinate(
                        Math.floor((Math.random() * (screen.right - screen.left)) + screen.left),
                        screen.top - 256
                    );
                } else {
                    const workArea = deskot.environment.getWorkArea();
                    deskot.anchor = new Coordinate(
                        Math.floor((Math.random() * (workArea.right - workArea.left)) + workArea.left),
                        workArea.top - 256
                    );
                }
                console.log(`Out of screen, Repositioning to ${deskot.anchor.toString()}`)

                const fallFactory = deskot.behaviorFactories.get("Fall")!;
                const fallBehavior = await fallFactory.build();

                deskot.setBehavior(fallBehavior);
            }
        } else {
            deskot.log(`Behavior completed: ${this.toString()}`);

            const nextBehavior = await BehaviorBuilder.buildRandomBehavior(deskot, this.name);
            deskot.setBehavior(nextBehavior!);
        }
    }


    onMousePressed(e: MouseEvent): void {
        console.log(e);
    }


    onMouseReleased(e: MouseEvent): void {
        console.log(e);
    }



    toString(): string {
        return `Behavior(DeskotInstanceName: ${this.deskot?.name}, Name: ${this.name}, Action: ${this.action.toString()})`;
    }


}



export default Behavior;