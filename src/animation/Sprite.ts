import Deskot from "../Deskot";
import ImagePair from "../image/ImagePair";
import Coordinate from "../position/Coordinate";
import Sound from "../sound/Sound";
import Nullable from "../type/Nullable";



class Sprite {

    readonly image: ImagePair;

    readonly dx: number;
    readonly dy: number;

    readonly duration: number;
    readonly sound: Nullable<Sound>;


    constructor(image: ImagePair, dx: number = 0, dy: number = 0, duration: number = 1, sound: Nullable<Sound> = null) {
        this.image = image;
        this.dx = dx;
        this.dy = dy;
        this.duration = duration;
        this.sound = sound;
    }


    next(deskot: Deskot) {
        // Deskot Anchor Set
        const nextX = deskot.anchor.x + (deskot.lookRight ? -this.dx : this.dx);
        const nextY = deskot.anchor.y + this.dy;
        deskot.anchor = new Coordinate(nextX, nextY);

        // Deskot Image Set
        deskot.image = this.image;
        
        // Deskot Sound Set
        if (this.sound != null) {
            deskot.windowManager.playSound(this.sound);
        }
    }

}


export default Sprite;