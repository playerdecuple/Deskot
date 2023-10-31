import Coordinate from "../position/Coordinate";
import Dimension from "../position/Dimension";


class DeskotImage {

    readonly src: ArrayBuffer;

    readonly center: Coordinate;

    readonly size: Dimension;


    constructor(src: ArrayBuffer, center: Coordinate, size: Dimension) {
        this.src = src;
        this.center = center;
        this.size = size;
    }

}



export default DeskotImage;