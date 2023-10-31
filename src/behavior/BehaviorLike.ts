import Deskot from "../Deskot";



interface BehaviorLike {

    isHidden: boolean;
    

    init(deskot: Deskot): void;

    next(): void;


    onMousePressed(e: MouseEvent): void;

    onMouseReleased(e: MouseEvent): void;

}


export default BehaviorLike;