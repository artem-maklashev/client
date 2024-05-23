import Defects from "./Defects";
import ProductionList from './../production/ProductionList';

class BoardDefectsLog {
    id: number;
    productionList: ProductionList;
    value: number;
    defects: Defects;

    constructor(id: number, productionList: ProductionList, value: number, defects: Defects) {
        this.id = id;
        this.productionList = productionList;
        this.value = value;
        this.defects = defects;
    }
}
export default BoardDefectsLog;