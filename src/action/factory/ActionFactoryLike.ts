import Action from "../Action";


interface ActionFactoryLike {

    build(attribute: any): Promise<Action>;

}


export default ActionFactoryLike;