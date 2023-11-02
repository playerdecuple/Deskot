import { BrowserWindow } from "electron";
import fs from "fs";
import { JSDOM } from "jsdom";

import Main from "../main";
import ActionFactoryLike from "./action/factory/ActionFactoryLike";
import ActionBuilder from "./action/factory/ActionBuilder";
import BehaviorBuilder from "./behavior/BehaviorBuilder";
import BehaviorLike from "./behavior/BehaviorLike";
import Nullable from "./type/Nullable";
import DeskotManager from "./DeskotManager";
import Coordinate from "./position/Coordinate";
import Rectangle from "./position/Rectangle";
import WindowManager from "./window/WindowManager";
import Sound from "./sound/Sound";
import DeskotEnvironment from "./environment/environments/DeskotEnvironment";
import ImagePair from "./image/ImagePair";



class Deskot {

    private static autoIncrumentIdCounter: number = 0;

    readonly id: number;

    readonly name: string;


    // A window that displays the deskot.
    public readonly windowManager: WindowManager;

    public manager: Nullable<DeskotManager>;
    
    // Ground coordinates of the deskot instance.
    public anchor: Coordinate = new Coordinate(0, 0);

    // Image to display
    public image: Nullable<ImagePair>;

    public lookRight: boolean = false;

    
    // Sound to play
    private sound: Nullable<Sound>;


    // Current behavior
    private behavior: Nullable<BehaviorLike>;


    // Increases with each tick of the timer.
    time = 0;


    // States
    private animating: boolean = true;

    private paused: boolean = false;

    private dragging: boolean = false;


    // Environment
    // TODO: Apply Environment

    private cursorPosition: Nullable<Coordinate> = null;


    readonly actionFactories = new Map<string, ActionFactoryLike>();

    readonly behaviorFactories = new Map<string, BehaviorBuilder>();


    readonly environment = new DeskotEnvironment(this);


    constructor(name: string) {
        this.id = Deskot.autoIncrumentIdCounter++;
        this.name = name;
        this.windowManager = new WindowManager(this, this.createWindow());
    }

    
    toString() {
        return `Deskot(ID: ${this.id}, Name: ${this.name}, Tick: ${this.time}, Anchor: (${this.anchor.x}, ${this.anchor.y}))`;
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

            for (const node of listNode.children) {
                if (node.tagName != "ACTION") continue;

                const action = new ActionBuilder(this, node);
                console.log(`Action load complete: ${action.toString()}`);
            }
        }

        for (const listNode of document.querySelectorAll("BehaviorList")) {
            console.log(`Reading next behavior lists...`);
            this.loadBehavior(listNode, []);
        }

        return this;
    }

    private loadBehavior(listNode: Element, conditions: Array<string> = []) {
        for (const node of listNode.children) {
            if (node.tagName == "BEHAVIOR") {

                const behavior = new BehaviorBuilder(this, node, conditions);
                const { name } = behavior;

                this.behaviorFactories.set(name, behavior);
                console.log(`Behavior load complete: ${behavior.toString()}`);

            } else if (node.tagName == "CONDITION") {

                const nodeCondition = node.getAttribute("condition")!;
                const nextCondition = [...conditions, nodeCondition];

                this.loadBehavior(node, nextCondition);

            }
        }
    }


    start() {
        Main.deskotManager.register(this);
    }


    setBehavior(behavior: BehaviorLike) {
        this.behavior = behavior;
        this.behavior.init(this);

        console.log(`[[ INSTANCE ${this.toString()} ]] Behavior is set to ${behavior.toString()}`);
    }


    createWindow(): BrowserWindow {
        return new BrowserWindow({
            width: 128,
            height: 128,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
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

    
    getBounds(): Rectangle {
        if (this.image != null) {
            const image = this.image.leftImage;

            const top = this.anchor.y - image.center.y;
            const left = this.anchor.x - image.center.x;

            const { width, height } = image.size;
            return new Rectangle(left, top, width, height);
        } else {
            return this.windowManager.window.getBounds() as Rectangle;
        }
    }


    setAnchor(anchor: Coordinate) {
        this.anchor = anchor;
    }

}


export default Deskot;