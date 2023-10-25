import fs from "fs";
import path from "path";

import Deskot from "./src/Deskot";
import DeskotManager from "./src/DeskotManager";



class Main {

    private static activeDeskotList: Array<string>;

    static deskotManager = new DeskotManager();

    
    static main() {
        try {
            this.loadConfiguration();
            this.loadDeskots();
        } catch (e) {
            throw new Error("Failed to load configuration file.");
        }
    }


    private static loadConfiguration() {
        const raw = fs.readFileSync(path.resolve(__dirname, "config", "./config.json")).toString();
        const config = JSON.parse(raw);

        this.activeDeskotList = config?.activeDeskotList as Array<string>;
        // TODO: Other configurations
    }


    private static loadDeskots() {
        for (const deskotName of this.activeDeskotList) {
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
        }
    }


}


Main.main();