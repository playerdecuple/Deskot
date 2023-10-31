import { BrowserWindow } from "electron";
import fs from "fs";
import { JSDOM } from "jsdom";

import Main from "../main";
import ActionFactoryLike from "./action/factory/ActionFactoryLike";
import ActionBuilder from "./action/factory/ActionBuilder";
import BehaviorBuilder from "./behavior/BehaviorBuilder";
import BehaviorLike from "./behavior/BehaviorLike";
import Nullable from "./type/Nullable";
import DeskotImage from "./image/DeskotImage";
import DeskotManager from "./DeskotManager";
import Coordinate from "./position/Coordinate";
import Rectangle from "./position/Rectangle";
import WindowManager from "./window/WindowManager";
import Sound from "./sound/Sound";



class Deskot {

    private static autoIncrumentIdCounter: number = 0;

    readonly id: number;

    readonly name: string;


    // A window that displays the deskot.
    private readonly windowManager: WindowManager;

    public manager: Nullable<DeskotManager>;
    
    // Ground coordinates of the deskot instance.
    private anchor: Coordinate = new Coordinate(0, 0);

    // Image to display
    private image: Nullable<DeskotImage>;

    private lookRight: boolean = false;

    
    // Sound to play
    private sound: Nullable<Sound>;


    // Current behavior
    private behavior: Nullable<BehaviorLike>;


    // Increases with each tick of the timer.
    time = 0;


    // States
    private animating: boolean = false;

    private paused: boolean = false;

    private dragging: boolean = false;


    // Environment
    // TODO: Apply Environment

    private cursorPosition: Nullable<Coordinate> = null;


    readonly actionFactories = new Map<string, ActionFactoryLike>();

    readonly behaviorFactories = new Map<string, BehaviorBuilder>();


    constructor(name: string) {
        this.id = Deskot.autoIncrumentIdCounter++;
        this.name = name;
        this.windowManager = new WindowManager(this.createWindow());
    }

    
    applyXml(xmlPath: string): Deskot {
        if (!fs.existsSync(xmlPath)) {
            throw new Error("Configuration xml not found.");
        }
        console.log(`Started loading xml file for deskot instance '${this.name}'. (XML file path: ${xmlPath})`);

        const xmlRaw = fs.readFileSync(xmlPath).toString();
        const dom = new JSDOM(xmlRaw);
        const document = dom.window.document;

        for (const listNode of document.querySelectorAll("ActionList")) {
            console.log(`Reading next action lists...`);
            for (const node of listNode.querySelectorAll("Action")) {
                const action = new ActionBuilder(this, node);
                const { name } = action;

                this.actionFactories.set(name, action);
                console.log(`Action Load Complete: ${action.toString()}`);
            }
        }

        for (const listNode of document.querySelectorAll("BehaviorList")) {
            console.log(`Reading next behavior lists...`);
            for (const node of listNode.querySelectorAll("Behavior")) {
                const behavior = new BehaviorBuilder(this, node, []);
                const { name } = behavior;

                this.behaviorFactories.set(name, behavior);
                console.log(`Behavior Load Complete: ${behavior.toString()}`);
            }
        }

        return this;
    }


    start() {
        Main.deskotManager.register(this);
    }


    setBehavior(behavior: BehaviorLike) {
        this.behavior = behavior;
        this.behavior.init(this);
    }


    createWindow(): BrowserWindow {
        return new BrowserWindow({
            width: 0,
            height: 0,
            webPreferences: {
                nodeIntegration: true
            },
            transparent: true,
            frame: false,
            alwaysOnTop: Main.config.alwaysOnTop
        });
    }



    tick() {
        if (this.isAnimating()) {
            if (this.behavior != null) {
                this.behavior.next();
            }

            this.time++;
        }
    }


    apply() {
        const manager = this.windowManager;
        const { window } = manager;

        if (this.isAnimating()) {
            if (this.image != null) {
                // Set the window region
                window.setBounds(this.getBounds());
                manager.setImage(this.image);
                manager.updateImage();
            }

            if (this.sound != null) {
                manager.playSound(this.sound);
            }
        }
    }


    private isAnimating() {
        return this.animating && !this.paused;
    }

    
    private getBounds(): Rectangle {
        if (this.image != null) {
            const top = this.anchor.y - this.image.center.y;
            const left = this.anchor.x - this.image.center.x;

            const { width, height } = this.image.size;
            return new Rectangle(top, left, width, height);
        } else {
            return this.windowManager.window.getBounds();
        }
    }

}


export default Deskot;