import Action from "../Action";


interface ActionFactoryLike {

    readonly attr: any;


    build(attribute: any): Promise<Action>;

}


export default ActionFactoryLike;