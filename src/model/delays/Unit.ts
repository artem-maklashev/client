import ProductionArea from "./ProductionArea";

class Unit {
    static fromJSON(unit: any): Unit {
        return new Unit(unit.id, unit.name, ProductionArea.fromJSON(unit.productionArea));
    }
    id: number;
    name: string;
    productionArea: ProductionArea;


    constructor(id: number, name: string, productionArea: ProductionArea) {
        this.id = id;
        this.name = name;
        this.productionArea = productionArea;
    }
}
export default Unit;