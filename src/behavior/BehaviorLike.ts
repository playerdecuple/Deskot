import Deskot from "../Deskot";



interface BehaviorLike {

    isHidden: boolean;
    

    init(deskot: Deskot): void;

    next(): void;


    onMousePressed(e: MouseEvent): void;

    onMouseReleased(e: MouseEvent): void;


    toString(): string;

}


export default BehaviorLike;