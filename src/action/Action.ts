import Deskot from "../Deskot";
import Animation from "../animation/Animation";
import Script from "../script/Script";

import LateInit from "../type/Lateinit";



abstract class Action {
    
    private deskot: LateInit<Deskot>;

    private animations: Array<Animation>;

    private params: any;


    private startTime: number = -1;

    
    // TODO: Change type of 'animations' local variable.
    constructor(animations: Array<Animation> = [], params: any = {}) {
        this.animations = animations;
        this.params = params;
    }


    init(deskot: Deskot) {
        this.deskot = deskot;
        this.setTime();

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


    protected setTime(time: number = 0) {
        this.startTime = this.deskot!!.time - time;
    }
    
    protected getTime() {
        return this.deskot!!.time - this.startTime;
    }


    protected tick() {}


    hasNext() {
        const isEffective = this.isEffective();
        const isRunning = this.getTime() < this.getDuration();

        return isEffective && isRunning;
    }

    
    isEffective(): boolean {
        // this.params.condition instanceof Script
        return this.params.condition?.get(this.params) ?? true;
    }

    isDraggable(): boolean {
        return this.params.draggable as boolean ?? true;
    }

    getDuration(): number {
        return this.params.duration as number ?? Infinity;
    }

}


export default Action;