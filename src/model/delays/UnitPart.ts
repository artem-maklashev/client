import Unit from "./Unit";

class UnitPart {
    id: number;
    name: string;
    unit: Unit;
    static fromJSON(json: any): UnitPart {
        return new UnitPart(json.id, json.name, Unit.fromJSON(json.unit));
    }   

    

    constructor(id: number, name: string, unit: Unit) {
        this.id = id;
        this.name = name;
        this.unit = unit;
    }
}
export default UnitPart;