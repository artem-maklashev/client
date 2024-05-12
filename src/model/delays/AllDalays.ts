import UnitPart from "./UnitPart";
import Shift from "../Shift";
import DelayType from "./DelayType";
import Product from './../Product';

class AllDelays <T extends Product>{
    id: number;
    delayDate: Date;
    startTime: Date;
    endTime: Date;
    unitPart: UnitPart;
    shift: Shift;
    product: T;
    delayType: DelayType;
    delta: number;



    constructor(id: number, delayDate: Date, startTime: Date, endTime: Date, unitPart: UnitPart, shift: Shift, product: T, delayType: DelayType) {
        this.id = id;
        this.delayDate = delayDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.unitPart = unitPart;
        this.shift = shift;
        this.product = product;
        this.delayType = delayType;
        this.delta = 0;
    }

    toString(): string {
        // Проверка, что startTime и endTime - объекты типа Date
            return this.delta.toString();
        }

}
export default AllDelays;