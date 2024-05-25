import Defects from "./Defects";
import ProductionList from './../production/ProductionList';

class BoardDefectsLog {
    id: number;
    productionList: ProductionList | null;
    value: number;
    defects: Defects;

    constructor(id: number, value: number, defects: Defects, productionList?: ProductionList) {
        this.id = id;
        this.productionList = productionList || null;
        this.value = value;
        this.defects = defects;
    }
}
export default BoardDefectsLog;