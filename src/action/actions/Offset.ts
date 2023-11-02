import Coordinate from "../../position/Coordinate";
import InstantAction from "../InstantAction";


class Offset extends InstantAction {


    constructor(params: any) {
        super(params);
    }

    apply(): void {
        const { x, y } = this.deskot!.anchor;

        this.deskot!.setAnchor(new Coordinate(
            this.getOffsetX() + x,
            this.getOffsetY() + y
        ));
    }


    private getOffsetX() {
        return this.params.offsetX ?? 0;
    }

    private getOffsetY() {
        return this.params.offsetY ?? 0;
    }


}


export default Offset;