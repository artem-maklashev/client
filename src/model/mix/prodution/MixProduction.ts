import Shift from "../../Shift";
import DryMix from "../DryMix";

class MixProduction {
    id: number;
    productionStart: Date;
    productionFinish: Date;
    productionDate: Date;
    shift: Shift;
    mix: DryMix;

    constructor(id: number, productionStart: Date, productionFinish: Date, productionDate: Date, shift: Shift, mix: DryMix ) {
        this.id = id;
        this.productionStart = productionStart;
        this.productionFinish = productionFinish;
        this.productionDate = productionDate;
        this.shift = shift;
        this.mix = mix;
    }
}
export default MixProduction;