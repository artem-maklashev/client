class ProductTypes {
    id: number;
    name: string;

    constructor();
    constructor(id: number, name: string);
    constructor(id?: number, name?: string) {
        this.id = id !== undefined ? id : 0;
        this.name = name !== undefined ? name : '';
    }

    static fromJSON(json: any): ProductTypes {
        return new ProductTypes(json.id, json.name);
    }
}
export default ProductTypes;
