class Shift {
    static fromJSON(shift: any): Shift {
        return new Shift(shift.id, shift.name);
    }
    id: number;
    name: string;

    constructor();
    constructor(id: number, name: string);
    constructor(id?: number, name?: string) {
        this.id = id !== undefined ? id : 0;
        this.name = name !== undefined ? name : '';
    }
}

export default Shift;