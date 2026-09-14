import UnitPart from "./UnitPart";
import Shift from "../Shift";
import DelayType from "./DelayType";
import Product from "./../Product";

// Тип входного объекта JSON (даты обычно приходят строками или timestamp)
export interface AllDelaysJSON {
    id: number;
    delayDate: string | number | Date;
    startTime: string | number | Date;
    endTime: string | number | Date;
    unitPart: any;
    shift: any;
    product: any;
    delayType: any;
    delta?: number;
}

class AllDelays<T extends Product> {
    id: number;
    delayDate: Date;
    startTime: Date;
    endTime: Date;
    unitPart: UnitPart;
    shift: Shift;
    product: T;
    delayType: DelayType;
    delta: number;

    constructor(
        id: number,
        delayDate: Date,
        startTime: Date,
        endTime: Date,
        unitPart: UnitPart,
        shift: Shift,
        product: T,
        delayType: DelayType
    ) {
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
        return this.delta.toString();
    }

    static fromJSON<T extends Product>(
        json: AllDelaysJSON,
        productFactory?: (data: any) => T
    ): AllDelays<T> {
        // Парсим вложенные объекты. Если у классов есть свои fromJSON, используем их:
        const unitPart = typeof UnitPart.fromJSON === "function" 
            ? UnitPart.fromJSON(json.unitPart) 
            : json.unitPart;

        const shift = typeof Shift.fromJSON === "function" 
            ? Shift.fromJSON(json.shift) 
            : json.shift;

        const delayType = typeof DelayType.fromJSON === "function" 
            ? DelayType.fromJSON(json.delayType) 
            : json.delayType;

        // Если для T передан кастомный парсер, вызываем его, иначе оставляем json.product
        const product = productFactory ? productFactory(json.product) : (json.product as T);

        const instance = new AllDelays<T>(
            json.id,
            new Date(json.delayDate),
            new Date(json.startTime),
            new Date(json.endTime),
            unitPart,
            shift,
            product,
            delayType
        );

        // Если в JSON уже был сохранен delta, восстанавливаем его
        if (typeof json.delta === "number") {
            instance.delta = json.delta;
        }

        return instance;
    }
}

export default AllDelays;