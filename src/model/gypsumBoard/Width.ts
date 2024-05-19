class Width {
    id: number;
    value: string;

    constructor();
    constructor(id: number, value: string);
    constructor(id?: number, value?: string) {
        this.id = id !== undefined ? id : 0;
        this.value = value !== undefined ? value : '';
    }
}
export default Width;
