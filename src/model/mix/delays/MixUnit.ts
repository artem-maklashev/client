import MixProductionArea from "./MixproductionArea";

class MixUnit {
    id: number;
    productionArea: MixProductionArea;
    name: string;

    constructor(id: number, productionArea: MixProductionArea, name: string) {
        this.id = id;
        this.productionArea = productionArea;
        this.name = name;
    }
}
export default MixUnit;