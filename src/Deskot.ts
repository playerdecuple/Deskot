import path from "path";
import fs from "fs";


class Deskot {

    private static autoIncrumentIdCounter: number = 0;

    readonly id: number;

    readonly name: string;


    constructor(name: string) {
        this.id = Deskot.autoIncrumentIdCounter++;
        this.name = name;
    }

    
    applyXml(xmlPath: string): Deskot {
        if (!fs.existsSync(xmlPath)) {
            throw new Error("Configuration xml not found.");
        }

        // TODO: Load XML file

        return this;
    }


    start() {

    }

}


export default Deskot;