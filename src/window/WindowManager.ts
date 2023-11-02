import { BrowserWindow, ipcMain } from "electron";
import path from "path";

import Nullable from "../type/Nullable";
import Sound from "../sound/Sound";
import Main from "../../main";
import ImagePair from "../image/ImagePair";
import Deskot from "../Deskot";



class WindowManager {

    readonly deskot: Deskot;

    readonly window: BrowserWindow;

    
    private image: Nullable<ImagePair>;


    constructor(deskot: Deskot, window: BrowserWindow) {
        this.deskot = deskot;
        this.window = window;
        this.initPage();
        this.initEventHandler();
    }


    private initPage() {
        const { window } = this;
        window.loadFile(path.resolve(Main.path, "./public/index.html"));
    }

    
    private initEventHandler() {
        ipcMain.on('draw-response', (e, timeline) => {
            // console.log(timeline);
        });
    }


    setImage(image: ImagePair) {
        this.image = image;
    }


    updateImage() {
        if (this.image != null) {
            this.window.webContents.send("draw", {
                image: this.image,
                isLookRight: this.deskot.lookRight
            });
        }
    }


    playSound(sound: Sound) {
        ipcMain.emit("play", sound);
    }

}


export default WindowManager;