import { ipcRenderer } from "electron";
import DeskotImage from "../../../src/image/DeskotImage";


const $ = (selector: string) => document.querySelectorAll(selector);


function listen() {
    const canvas = $("canvas")[0] as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');


    ipcRenderer.on("draw", (e, image: DeskotImage) => {
        const { width, height } = image.size;
        const clampedArray = new Uint8ClampedArray(image.src);
        const imageData = new ImageData(clampedArray, width, height);

        canvas.setAttribute("width", width.toString());
        canvas.setAttribute("height", height.toString());

        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.putImageData(imageData, image.center.x - image.size.width / 2, image.center.y - image.size.height / 2);
    });


    ipcRenderer.on("play", (e) => {
        // TODO:
    });
}



window.onload = () => {
    listen();
};