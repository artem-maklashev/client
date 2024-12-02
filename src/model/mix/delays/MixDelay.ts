import MixProduction from "../prodution/MixProduction";
import MixUnitPart from "./MixUnitPart";

class MixDelay {
    id: number;    
    mixProduction: MixProduction;
    delayStart: Date;
    delayEnd: Date;
    mixUnitPart: MixUnitPart;

    constructor(id: number, mixProduction: MixProduction, delayStart: Date, delayEnd: Date, mixUnitPart: MixUnitPart) {
        this.id = id;        
        this.mixProduction = mixProduction;
        this.delayStart = delayStart;
        this.delayEnd = delayEnd;
        this.mixUnitPart = mixUnitPart;
    }
}

export default MixDelay;