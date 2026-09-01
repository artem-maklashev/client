class Material {
    static fromJSON(material: any): Material {
        return new Material(material.id, material.name);
    }
    
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
export default Material;