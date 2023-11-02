import Deskot from "../Deskot";



class Script {

    private deskot: Deskot;

    private readonly parameter: any = {};

    private script: string;

    private initAtFrame: boolean;


    private lastValue: any;


    constructor(deskot: Deskot, script: string, initAtFrame: boolean) {
        this.deskot = deskot;
        this.script = script;
        this.initAtFrame = initAtFrame;

        this.parameter.deskot = this.deskot;
    }


    getValue() {
        return this.lastValue;
    }

    private setValue(newValue: any): any {
        this.lastValue = newValue;
        return newValue;
    }


    get(parameter: any = {}): any {
        const constructorParameter = { ...this.parameter, ...parameter };
        try {
            const evaluateInstance = new Function(...Object.keys(constructorParameter), `return ${this.script}`);
            this.setValue(evaluateInstance.call(Object.values(constructorParameter)));
            return this.getValue();
        } catch (e) {
            throw new Error("Failed to evaluate script.");
        }
    }


    init() {
        this.setValue(null);
    }

    initFrame() {
        if (this.initAtFrame) {
            this.init();
        }
    }

}


export default Script;