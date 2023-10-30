import path from "path";

import Nullable from "../type/Nullable";
import DeskotImage from "./DeskotImage";
import Deskot from "../Deskot";



class ImagePair {

    readonly leftImage: DeskotImage;

    readonly rightImage: DeskotImage;

    readonly anchor: Coordinate;


    constructor(image: DeskotImage, rightImage: DeskotImage, anchor: Coordinate) {
        this.leftImage = image;
        this.rightImage = rightImage;
        this.anchor = anchor;
    }


    private static async load(imagePath: string, deskot: Deskot, useMirror: boolean = false): Promise<ArrayBuffer> {
        try {
            const raw = await fetch(path.resolve(__dirname, "deskots", deskot.name, imagePath));
            let blob = await raw.blob();
            
            if (useMirror) {
                const bitmap = await createImageBitmap(blob, { imageOrientation: "flipY" });
                const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
                const ctx = canvas.getContext('2d');

                ctx!!.drawImage(bitmap, 0, 0);
                blob = await canvas.convertToBlob();
            }

            return blob.arrayBuffer();
        } catch (e) {
            throw new Error("Failed to load sprite image.");
        }
    }


    static async loadPair(leftPath: string, rightPath: Nullable<string>, anchor: Coordinate, deskot: Deskot): Promise<ImagePair> {
        const [ leftImage, rightImage ] = await Promise.all([leftPath, rightPath].map((path, idx) =>
        
            new Promise(async (res, _) => {
                let result: ArrayBuffer;

                if (path == null) {
                    if (idx === 1) {
                        result = await ImagePair.load(leftPath, deskot, true);
                    } else {
                        throw new Error("Sprite path is required.");;
                    }
                } else {
                    result = await ImagePair.load(path, deskot);
                }

                const buffer = new Uint8Array(result);
                res(new DeskotImage(buffer, anchor));
            }) as Promise<DeskotImage>

        ));
        
        return new ImagePair(leftImage, rightImage, anchor);
    }
    
}



export default ImagePair;