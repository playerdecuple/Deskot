import Deskot from "../Deskot";



class Script {

    private deskot: Deskot;

    private readonly parameter: any = {};

    private script: string;

    private initAtFrame: boolean;


    private lastValue: any = null;


    constructor(deskot: Deskot, script: string, initAtFrame: boolean) {
        this.deskot = deskot;
        this.script = script;
        this.initAtFrame = initAtFrame;

        this.parameter.deskot = this.deskot;
    }


    get value() {
        return this.lastValue;
    }

    private set value(newValue: any) {
        this.lastValue = newValue;
    }


    get(parameter: any = {}): any {
        if (this.value != null) {
            return this.lastValue;
        }

        const constructorParameter = { ...this.parameter, ...parameter };

        let script = this.script;
        if (script.startsWith("${") && script.endsWith("}")) {
            script = script.substring(2, script.length - 1);
        } else if (script.startsWith("#{") && script.endsWith("}")) {
            script = script.substring(2, script.length - 1);
        }

        try {
            const evaluateInstance = new Function(...Object.keys(constructorParameter), `
                return ${script};
            `);
            this.value = evaluateInstance(...Object.values(constructorParameter));
            return this.value;
        } catch (e) {
            console.error(`--- On script ---\n${script}\n-----------------`);
            console.error(e);
            throw new Error("Failed to evaluate script.");
        }
    }


    init() {
        this.value = null;
    }

    initFrame() {
        if (this.initAtFrame) {
            this.init();
        }
    }

}


export default Script;