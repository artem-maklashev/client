class Width {
    id: number;
    value: string;

    constructor();
    constructor(id: number, value: string);
    constructor(id?: number, value?: string) {
        this.id = id !== undefined ? id : 0;
        this.value = value !== undefined ? value : '';
    }
    toString() {
        return this.value;
    }
    static fromJSON(json: any): Width {
        return new Width(json.id, json.value);
    }
}
export default Width;
