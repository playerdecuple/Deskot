import path from "path";
import fs from "fs";
import imageSize from "image-size";

import Nullable from "../type/Nullable";
import DeskotImage from "./DeskotImage";
import Deskot from "../Deskot";
import Coordinate from "../position/Coordinate";
import Dimension from "../position/Dimension";
import Main from "../../main";



class ImagePair {

    readonly leftImage: DeskotImage;

    readonly rightImage: Nullable<DeskotImage>;

    readonly anchor: Coordinate;


    constructor(image: DeskotImage, rightImage: Nullable<DeskotImage>, anchor: Coordinate) {
        this.leftImage = image;
        this.rightImage = rightImage;
        this.anchor = anchor;
    }


    private static load(imagePath: string, deskot: Deskot): Blob {
        try {
            const absolutePath = path.resolve(Main.path, "deskots", deskot.name, imagePath);
            const buffer = fs.readFileSync(absolutePath);
            let blob = new Blob([ buffer ], { type: "image/png" });

            return blob;
        } catch (e) {
            console.error(e);
            throw new Error("Failed to load sprite image.");
        }
    }


    static async loadPair(leftPath: string, rightPath: Nullable<string>, anchor: Coordinate, deskot: Deskot): Promise<ImagePair> {
        const [ leftImage, rightImage ] = await Promise.all([leftPath, rightPath].map((imagePath, idx) =>
        
            new Promise(async (res, _) => {
                let result: ArrayBuffer;
                let blob: Blob;

                if (imagePath == null) {
                    res(null);
                    return;
                } else {
                    blob = ImagePair.load(imagePath, deskot);
                }

                result = await blob.arrayBuffer();
                
                const absolutePath = path.resolve(Main.path, "deskots", deskot.name, imagePath);
                const { width, height } = imageSize(absolutePath);

                const buffer = new Uint8Array(result);
                const dimension = new Dimension(width!, height!);

                res(new DeskotImage(buffer, anchor, dimension));
            }) as Promise<Nullable<DeskotImage>>

        ));
        
        return new ImagePair(leftImage!, rightImage, anchor);
    }
    
}



export default ImagePair;