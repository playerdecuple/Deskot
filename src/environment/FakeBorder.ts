import Coordinate from "../position/Coordinate";
import Border from "./Border";



class FakeBorder implements Border {

    static readonly instance_ = new this();


    isOn(_: Coordinate): boolean {
        return false;
    }


    move(location: Coordinate): Coordinate {
        return location;
    }
    
}


export default FakeBorder;