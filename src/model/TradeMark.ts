class TradeMark {
    id: number;
    name: string;

    constructor();
    constructor(id: number, name: string);
    constructor(id?: number, name?: string) {
        this.id = id !== undefined ? id : 0;
        this.name = name !== undefined ? name : '';
    }

    toString() {
        return this.name;
    }
}
export default TradeMark;
