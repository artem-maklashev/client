import DelayType from "../../delays/DelayType";
import MixProduction from "../prodution/MixProduction";
import MixUnitPart from "./MixUnitPart";

class MixDelay {
    id: number;
    delayType: DelayType;
    mixProduction: MixProduction;
    delayStart: Date;
    delayEnd: Date;
    mixUnitPart: MixUnitPart;

    constructor(id: number, delayType: DelayType, mixProduction: MixProduction, delayStart: Date, delayEnd: Date, mixUnitPart: MixUnitPart) {
        this.id = id;
        this.delayType = delayType;
        this.mixProduction = mixProduction;
        this.delayStart = delayStart;
        this.delayEnd = delayEnd;
        this.mixUnitPart = mixUnitPart;
    }
}

export default MixDelay;