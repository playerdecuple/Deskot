class DeskotImage {

    readonly src: Uint8Array;

    readonly anchor: Coordinate;


    constructor(src: Uint8Array, anchor: Coordinate) {
        this.src = src;
        this.anchor = anchor;
    }

}



export default DeskotImage;