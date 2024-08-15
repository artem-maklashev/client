import UnitPart from "./UnitPart";
import Shift from "../Shift";
import GypsumBoard from "../gypsumBoard/GypsumBoard";
import DelayType from "./DelayType";
import AllDelays from "./AllDalays";

class Delays extends AllDelays<GypsumBoard> {
    value: any;
    



    constructor(id: number, delayDate: Date, startTime: Date, endTime: Date, unitPart: UnitPart, shift: Shift, product: GypsumBoard, delayType: DelayType) {
        super(id, delayDate,startTime, endTime,unitPart,shift, product, delayType);        
        this.delta = 0;
    }

    toString(): string {
        // Проверка, что startTime и endTime - объекты типа Date
            return this.delta.toString();
        }

}
export default Delays;