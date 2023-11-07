import { BrowserWindow, ipcMain } from "electron";
import path from "path";

import Nullable from "../type/Nullable";
import Sound from "../sound/Sound";
import Main from "../../main";
import ImagePair from "../image/ImagePair";
import Deskot from "../Deskot";
import Behavior from "../behavior/Behavior";



class WindowManager {

    readonly deskot: Deskot;

    window: BrowserWindow;

    
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
        window.webContents.openDevTools();
    }

    
    private initEventHandler() {
        ipcMain.on('draw-fail', (_) => {
            this.deskot.log(`Auto-reloading Window...`);
        });

        ipcMain.on('execute-behavior', async (e, behaviorName) => {
            if (!this.deskot.behaviorFactories.has(behaviorName)) {
                e.reply('execute-behavior/failed', `Behavior '${behaviorName}' not found.`);
            }

            const behaviorFactory = this.deskot.behaviorFactories.get(behaviorName);

            try {
                const behavior = await behaviorFactory?.build();
                this.deskot.setBehavior(behavior!);
            } catch (ex) {
                e.reply('execute-behavior/failed', `Failed to execute the behavior.\n\n${ex}`);
            }
        });

        ipcMain.on('do-action', async (e, actionName) => {
            if (!this.deskot.actionFactories.has(actionName)) {
                e.reply('do-action/failed', `Action '${actionName}' not found.`);
            }

            const actionFactory = this.deskot.actionFactories.get(actionName);

            try {
                const action = await actionFactory?.build({});
                this.deskot.setBehavior(new Behavior("UserRequestBehavior", action!, true));
            } catch (ex) {
                e.reply('do-action/failed', `Failed to execute the action.\n\n${ex}`);
            }
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