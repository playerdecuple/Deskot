import path from "path";
import Deskot from "../Deskot";


class Sound {

    readonly src: Uint8Array;

    readonly volume: number;


    constructor(buffer: Uint8Array, volume: number) {
        this.src = buffer;
        this.volume = volume;
    }


    static async load(soundPath: string, volume: number, deskot: Deskot) {
        const raw = await fetch(path.resolve(__dirname, "deskots", deskot.name, soundPath));
        const blob = await raw.blob();

        const buffer = await blob.arrayBuffer();
        return new this(new Uint8Array(buffer), volume);
    }

}


export default Sound;