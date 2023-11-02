import Deskot from "../Deskot";
import Nullable from "../type/Nullable";
import Script from "../script/Script";
import Sprite from "./Sprite";



class Animation {

    private condition: Nullable<Script>;

    private readonly sprites: Array<Sprite>;


    constructor(condition: Nullable<Script>, sprites: Array<Sprite>) {
        if (!sprites.length) {
            throw new Error("Empty sprite list.");
        }

        this.condition = condition;
        this.sprites = sprites;
    }


    isEffective(params: any): boolean {
        return this.condition == null || this.condition.get(params) as boolean;
    }

    
    init() {
        this.condition?.init();
    }

    initFrame() {
        this.condition?.initFrame();
    }


    next(deskot: Deskot, time: number) {
        this.getSpriteAt(time)?.next(deskot);
    }


    getSpriteAt(time: number): Nullable<Sprite> {
        time %= this.getDuration();

        for (const sprite of this.sprites) {
            time -= sprite.duration;
            if (time < 0) {
                return sprite;
            }
        }

        return null;
    }


    getDuration(): number {
        let time = this.sprites.reduce((a, sprite) => a + sprite.duration, 0);
        return time;
    }

}


export default Animation;