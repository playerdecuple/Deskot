import Coordinate from "../position/Coordinate";


interface Border {

    isOn(location: Coordinate): boolean;

    move(location: Coordinate): Coordinate;

}


export default Border;