import Deskot from "../../Deskot";
import Animation from "../../animation/Animation";
import Coordinate from "../../position/Coordinate";
import Action from "../Action";


class Fall extends Action {

    private defaultResistanceX: number = .05;

    private defaultResistanceY: number = .1;


    private defaultInitialVX: number = 0;
    
    private defaultInitialVY: number = 0;


    private defaultGravity: number = 2;


    private velocityX: number = 0;

    private velocityY: number = 0;


    private modX: number = 0;

    private modY: number = 0;


    constructor(animations: Array<Animation>, params: any) {
        super(animations, params);
    }


    override init(deskot: Deskot) {
        super.init(deskot);

        this.velocityX = this.initialVX;
        this.velocityY = this.initialVY;
    }


    override hasNext(): boolean {
        const { deskot } = this;
        const { environment, anchor } = deskot!!;

        let onBorder = environment.floor.isOn(anchor)
                    || environment.wall.isOn(anchor);

        return super.hasNext() && !onBorder;
    }


    protected override tick() {
        const deskot = this.deskot!!;

        if (this.velocityX != 0) {
            deskot.lookRight = this.velocityX > 0;
        }

        this.velocityX -= this.velocityX * this.resistanceX;
        this.velocityY -= this.velocityY * this.resistanceY;
        this.velocityY += this.gravity;

        this.params.velocityX = this.velocityX;
        this.params.velocityY = this.velocityY;

        this.modX += this.velocityX % 1;
        this.modY += this.velocityY % 1;

        const dx = Math.floor(this.velocityX + this.modX);
        const dy = Math.floor(this.velocityY + this.modY);

        this.modX %= 1;
        this.modY %= 1;

        const dev = Math.max(1, Math.abs(dx), Math.abs(dy));
        const startPoint = { ...deskot.anchor } as Coordinate;

        let canLoop = true;
        for (let i = 0; i <= dev && canLoop; ++i) {
            const x = startPoint.x + dx * i / dev;
            const y = startPoint.y + dy * i / dev;

            deskot.anchor = new Coordinate(startPoint.x, y);
            
            if (dy > 0) {
                for (let j = -80; j <= 0; ++j) {
                    deskot.anchor = new Coordinate(x, y + j);
                    if (deskot.environment.getFloor(true).isOn(deskot.anchor)) {
                        canLoop = false;
                        break;
                    }
                }
            }

            if (deskot.environment.getWall(true).isOn(deskot.anchor)) {
                break;
            }
        }

        this.animation?.next(deskot, this.time);
    }


    get initialVX() {
        return this.params?.initialVX ?? this.defaultInitialVX;
    }
    get initialVY() {
        return this.params?.initialVY ?? this.defaultInitialVY;
    }

    get gravity() {
        return this.params?.gravity ?? this.defaultGravity;
    }

    get resistanceX() {
        return this.params?.resistanceX ?? this.defaultResistanceX;
    }
    get resistanceY() {
        return this.params?.resistanceY ?? this.defaultResistanceY;
    }
    
}


export default Fall;