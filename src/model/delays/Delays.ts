import UnitPart from "./UnitPart";
import Shift from "../Shift";
import GypsumBoard from "../gypsumBoard/GypsumBoard";
import DelayType from "./DelayType";
import AllDelays from "./AllDalays";

class Delays extends AllDelays<GypsumBoard> {
    static fromJSON(delaysList: any) {
        return new Delays(delaysList.id, new Date(delaysList.delayDate), new Date(delaysList.startTime), 
        new Date(delaysList.endTime), delaysList.unitPart, delaysList.shift, delaysList.product, delaysList.delayType);
    }
    



    constructor(id: number, delayDate: Date, startTime: Date, endTime: Date, unitPart: UnitPart, shift: Shift, product: GypsumBoard, delayType: DelayType) {
        super(id, delayDate, startTime, endTime, unitPart, shift, product, delayType);

        // С сервера даты могут прийти строками (ISO), поэтому нормализуем их в Date,
        // иначе вызов .getTime() упадёт с ошибкой "getTime is not a function".
        this.delayDate = new Date(delayDate);
        this.startTime = new Date(startTime);
        this.endTime = new Date(endTime);

        const startMs = this.startTime.getTime();
        const endMs = this.endTime.getTime();
        // Защита от некорректных/перевёрнутых дат: длительность = 0 вместо NaN
        this.delta = (isNaN(startMs) || isNaN(endMs) || endMs < startMs) ? 0 : (endMs - startMs) / (1000 * 60);
    }

    toString(): string {
        // Проверка, что startTime и endTime - объекты типа Date
            return this.delta.toString();
        }
    getDelta(): number {
        return this.delta;
    }
}
export default Delays;