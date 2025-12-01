import Shift from "../Shift";
import ProductTypes from "../ProductTypes";

export default class ProductionList {
    static fromJSON(productionList: any): ProductionList {
        return new ProductionList(
            productionList.id,
            new Date(productionList.productionStart),   // ← Date из строки
            new Date(productionList.productionFinish),
            new Date(productionList.productionDate),
            Shift.fromJSON(productionList.shift),        // ← десериализация!
            ProductTypes.fromJSON(productionList.type)   // ← десериализация!
        );
    }
    id: number;
    productionStart: Date;
    productionFinish: Date;
    productionDate: Date;
    shift: Shift;
    type: ProductTypes;

    constructor();
    constructor(id: number, pStart: Date, pEnd: Date, pDate: Date, shift: Shift, pTypeId: ProductTypes);
    constructor(id?: number, pStart?: Date, pEnd?: Date, pDate?: Date, shift?: Shift, pTypeId?: ProductTypes) {
        this.id = id || 0;
        this.productionStart = pStart || new Date();
        this.productionFinish = pEnd || new Date();
        this.productionDate = pDate || new Date();
        this.shift = shift || new Shift();
        this.type = pTypeId || new ProductTypes();
    }
}
