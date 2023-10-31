import { BrowserWindow, ipcMain } from "electron";
import path from "path";

import Deskot from "../Deskot";
import DeskotImage from "../image/DeskotImage";
import Nullable from "../type/Nullable";
import Sound from "../sound/Sound";
import Main from "../../main";



class WindowManager {

    readonly window: BrowserWindow;

    
    private image: Nullable<DeskotImage>;


    constructor(window: BrowserWindow) {
        this.window = window;
        this.initPage();
    }


    private initPage() {
        const { window } = this;
        window.loadFile(path.resolve(Main.path, "./public/index.html"));
    }


    setImage(image: DeskotImage) {
        this.image = image;
    }

    updateImage() {
        if (this.image != null) {
            ipcMain.emit("draw", this.image);
        }
    }


    playSound(sound: Sound) {
        ipcMain.emit("play", sound);
    }

}


export default WindowManager;