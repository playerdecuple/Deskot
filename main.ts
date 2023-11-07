import { app } from "electron";
import fs from "fs";
import path from "path";

import Deskot from "./src/Deskot";
import DeskotManager from "./src/DeskotManager";
import Coordinate from "./src/position/Coordinate";
import BehaviorBuilder from "./src/behavior/BehaviorBuilder";



class Main {

    private static activeDeskotList: Array<string>;

    static config: any;

    static deskotManager = new DeskotManager();

    static path = path.resolve(__dirname);

    
    static main() {
        try {
            this.loadConfiguration();
            this.loadDeskots();
        } catch (e) {
            console.error(e);
            throw new Error("Failed to load configuration file.");
        }
        this.deskotManager.start();
    }


    private static loadConfiguration() {
        const raw = fs.readFileSync(path.resolve(__dirname, "config", "./config.json")).toString();
        const config = JSON.parse(raw);

        this.activeDeskotList = config?.activeDeskotList as Array<string>;
        this.config = config;
    }


    private static loadDeskots() {
        for (const deskotName of this.activeDeskotList) {
            this.createDeskot(deskotName);
        }
    }


    private static createDeskot(deskotName: string) {
        console.log(`Creating Deskot instance... (Deskot Instance Name: ${deskotName})`)

        const deskotPath = path.resolve(__dirname, "deskots", deskotName);
        const deskotInstance = new Deskot(deskotName);
        
        let actionsXmlPath = path.resolve(deskotPath, "./actions.xml");
        let behaviorsXmlPath = path.resolve(deskotPath, "./behaviors.xml");

        if (!fs.existsSync(actionsXmlPath)) {
            actionsXmlPath = path.resolve(__dirname, "config", "./default-actions.xml");
        }
        if (!fs.existsSync(behaviorsXmlPath)) {
            behaviorsXmlPath = path.resolve(__dirname, "config", "./default-behaviors.xml");
        }

        deskotInstance.applyXml(actionsXmlPath)
                      .applyXml(behaviorsXmlPath)
                      .start();
        this.initDeskot(deskotInstance);
    }


    private static async initDeskot(deskotInstance: Deskot) {
        console.log(`Initializing Deskot instance... (${deskotInstance.toString()})`);
        
        deskotInstance.anchor = new Coordinate(-4000, -4000);
        deskotInstance.lookRight = Math.random() < 0.5;

        try {
            const behavior = await BehaviorBuilder.buildRandomBehavior(deskotInstance, null);
            deskotInstance.setBehavior(behavior!);
        } catch (e) {
            console.error(e);
            throw new Error("Failed to initalize the first action.");
        }
    }


}



// Execute main method

app.on("ready", () => {
    Main.main();
});


export default Main;