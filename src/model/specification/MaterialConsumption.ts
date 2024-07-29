import ProductionList from "../production/ProductionList";
import Material from "./Material";

class MaterialConsumption {
    private id: number;
    private productionList: ProductionList;
    private material: Material;
    private quantity: number;


    constructor($id: number, $productionList: ProductionList, $material: Material, $quantity: number) {
        this.id = $id;
        this.productionList = $productionList;
        this.material = $material;
        this.quantity = $quantity;
    }


    /**
     * Getter $productionList
     * @return {ProductionList}
     */
    public get $productionList(): ProductionList {
        return this.productionList;
    }

    /**
     * Setter $productionList
     * @param {ProductionList} value
     */
    public set $productionList(value: ProductionList) {
        this.productionList = value;
    }

    /**
     * Getter $id
     * @return {number}
     */
    public get $id(): number {
        return this.id;
    }

    /**
     * Setter $id
     * @param {number} value
     */
    public set $id(value: number) {
        this.id = value;
    }

    /**
     * Getter $material
     * @return {Material}
     */
    public get $material(): Material {
        return this.material;
    }

    /**
     * Setter $material
     * @param {Material} value
     */
    public set $material(value: Material) {
        this.material = value;
    }

    /**
     * Getter $quantity
     * @return {number}
     */
	public get $quantity(): number {
		return this.quantity;
	}

    /**
     * Setter $quantity
     * @param {number} value
     */
	public set $quantity(value: number) {
		this.quantity = value;
	}
}
export default MaterialConsumption;