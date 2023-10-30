import { BrowserWindow } from "electron";
import fs from "fs";
import { JSDOM } from "jsdom";

import Main from "../main";
import ActionFactoryLike from "./action/factory/ActionFactoryLike";
import ActionBuilder from "./action/factory/ActionBuilder";
import Action from "./action/Action";



class Deskot {

    private static autoIncrumentIdCounter: number = 0;

    private readonly window: BrowserWindow;


    readonly id: number;

    readonly name: string;


    readonly actionFactories = new Map<string, ActionFactoryLike>();

    readonly actions = new Map<string, Action>();

    // TODO: Define behavior dictionary object

    time = 0;


    constructor(name: string) {
        this.id = Deskot.autoIncrumentIdCounter++;
        this.name = name;
        this.window = this.createWindow();
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


        // TODO: Apply Behavior XML

        return this;
    }


    start() {
        Main.deskotManager.register(this);
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

    }

}


export default Deskot;