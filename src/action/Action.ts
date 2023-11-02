import Deskot from "../Deskot";
import Animation from "../animation/Animation";
import Script from "../script/Script";

import LateInit from "../type/Lateinit";
import Nullable from "../type/Nullable";
import DomUtil from "../utils/DomUtil";



abstract class Action {
    
    protected deskot: LateInit<Deskot>;

    protected animations: Array<Animation>;

    protected params: any;


    private startTime: number = -1;

    
    constructor(animations: Array<Animation> = [], params: any = {}) {
        this.animations = animations;
        this.params = params;
    }


    init(deskot: Deskot) {
        this.deskot = deskot;
        this.time = 0;

        this.params.deskot = deskot;
        this.params.action = this;

        for (const param of Object.values(this.params)) {
            if (param instanceof Script) {
                param.init();
            }
        }
        for (const animation of this.animations) {
            animation.init();
        }

        console.log(`[[ INSTANCE ${deskot.toString()} ]] Action initalized: ${this.params.name}, ${this.time}`);
    }


    next() {
        this.initFrame();
        this.tick();
    }


    initFrame() {
        for (const param of Object.values(this.params)) {
            if (param instanceof Script) {
                param.initFrame();
            }
        }
        for (const animation of this.animations) {
            animation.initFrame();
        }
    }
    

    toString() {
        return `${this.constructor.name}@Action (Name: ${this.params.name ?? "undefined"})`;
    }


    protected get time() {
        return this.deskot!.time - this.startTime;
    }
    protected set time(time: number) {
        this.startTime = this.deskot!.time - time;
    }


    protected tick() {}


    hasNext(): boolean {
        const isEffective = this.isEffective();
        const isRunning = this.time < this.getDuration();

        return isEffective && isRunning;
    }

    
    isEffective(): boolean {
        // this.params.condition instanceof Script
        return this.params.condition?.get(this.params) ?? true;
    }

    isDraggable(): boolean {
        return this.params.draggable as boolean ?? true;
    }

    
    protected get animation(): Nullable<Animation> {
        for (const animation of this.animations) {
            if (animation.isEffective(this.params)) {
                return animation;
            }
        }
        return null;
    }


    getDuration(): number {
        if (this.params.duration === undefined) {
            return Infinity;
        }

        const duration = DomUtil.parse(this.deskot!, this.params.duration);
        if (duration instanceof Script) {
            return duration.get(this.params);
        } else {
            return duration as number;
        }
    }


    validate(): boolean {
        return true;
    }

}


export default Action;