class BoardType {
    id: number;
    name: string;
    description?: string;

    constructor();
    constructor(id: number, name: string, description?: string);
    constructor(id?: number, name?: string, description?: string) {
        this.id = id !== undefined ? id : 0;
        this.name = name !== undefined ? name : '';
        this.description = description;
    }
}
export default BoardType;
