import Deskot from "../../Deskot";
import Coordinate from "../../position/Coordinate";
import Script from "../../script/Script";
import InstantAction from "../InstantAction";


class Offset extends InstantAction {


    constructor(_: Array<any>, params: any) {
        super(params);
    }


    override init(deskot: Deskot) {
        super.init(deskot);
    }


    apply(): void {
        const { x, y } = this.deskot!.anchor;

        this.deskot!.anchor = new Coordinate(
            this.offsetX + x,
            this.offsetY + y
        );
    }


    get offsetX(): number {
        let x = this.params.x ?? 0;
        if (x instanceof Script) {
            x = x.get(this.params);
        }

        return x;
    }


    get offsetY(): number {
        let y = this.params.y ?? 0;
        if (y instanceof Script) {
            y = y.get(this.params);
        }

        return y;
    }

}


export default Offset;