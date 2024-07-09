import Shift from "../Shift";
import ProductTypes from "../ProductTypes";

class ProductionList {
    id: number;
    productionStart: Date;
    productionFinish: Date;
    productionDate: Date;
    shift: Shift;
    type: ProductTypes;

    constructor(id: number, pStart: Date, pEnd: Date, pDate: Date, shift: Shift,pTypeId: ProductTypes ) {
        this.id = id;
        this.productionStart = pStart;
        this.productionFinish = pEnd;
        this.productionDate = pDate;
        this.shift = shift;
        this.type = pTypeId;
    }

    
}
export default ProductionList;