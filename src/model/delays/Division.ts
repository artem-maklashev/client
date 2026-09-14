class Division {
    static fromJSON(division: any): Division {
        return new Division(division.id, division.name);
    }
    id:number;
    name: string;


    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
export default Division;