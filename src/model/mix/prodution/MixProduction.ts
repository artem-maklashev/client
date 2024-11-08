import Shift from "../../Shift";
import DryMix from "../DryMix";

class MixProduction {
    id: number;
    productionStart: Date;
    productionFinish: Date;
    productionDate: Date;
    shift: Shift;
    mix: DryMix;

    constructor(
        id: number = -1, 
        productionStart: Date = new Date(), 
        productionFinish: Date = new Date(), 
        productionDate: Date = new Date(), 
        shift: Shift = new Shift(), 
        mix: DryMix = new DryMix()
    ) {
        this.id = id;
        this.productionStart = productionStart;
        this.productionFinish = productionFinish;
        this.productionDate = productionDate;
        this.shift = shift;
        this.mix = mix;
    }
}
export default MixProduction;
