import Division from "./Division";

class ProductionArea {
    static fromJSON(productionArea: any): ProductionArea {
        return new ProductionArea(productionArea.id, productionArea.name, Division.fromJSON(productionArea.division));
    }
    id: number;
    name: string;
    division: Division;


    constructor(id: number, name: string, division: Division) {
        this.id = id;
        this.name = name;
        this.division = division;
    }
}
export default ProductionArea;