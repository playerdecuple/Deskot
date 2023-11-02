import Area from "../Area";
import Environment from "../Environment";



class GenericEnvironment extends Environment {

    constructor() {
        super();
        super.start();
    }


    public getWorkArea(): Area {
        return Environment.screen;
    }

    
    protected refreshCache(): void {
        // I feel so refreshed
    }

}


export default GenericEnvironment;