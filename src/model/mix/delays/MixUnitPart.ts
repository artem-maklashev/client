import MixUnit from "./MixUnit";

class MixUnitPart {
    id: number;
    unit: MixUnit;
    name: string;
    constructor(id: number, unit: MixUnit, name: string) {
        this.id = id;
        this.unit = unit;
        this.name = name;
    }
}
export default MixUnitPart;