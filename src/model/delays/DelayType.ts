class DelayType {
    id: number;
    name: string;
    static fromJSON(json: any) : DelayType {
        return new DelayType(json.id, json.name);
    } ;


    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
export default DelayType;