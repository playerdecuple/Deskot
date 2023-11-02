import InstantAction from "../InstantAction";



class Look extends InstantAction {

    constructor(params: any) {
        super(params);
    }


    apply(): void {
        this.deskot!.lookRight = this.isLookRight();
    }


    private isLookRight() {
        return this.params.lookRight ?? !this.deskot?.lookRight;
    }

}


export default Look;