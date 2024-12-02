import DelayType from "../../delays/DelayType";
import MixUnit from "./MixUnit";

class MixUnitPart {
    id: number;
    unit: MixUnit;
    name: string;
    delayType: DelayType;
    constructor(id: number, unit: MixUnit, name: string, delayType: DelayType) {
        this.id = id;
        this.unit = unit;
        this.name = name;
        this.delayType = delayType;
    }
}
export default MixUnitPart;