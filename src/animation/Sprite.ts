import Deskot from "../Deskot";
import ImagePair from "../image/ImagePair";
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
        // TODO: Deskot Anchor Set
        // TODO: Deskot Image Set
        // TODO: Deskot Sound Set
    }

}


export default Sprite;