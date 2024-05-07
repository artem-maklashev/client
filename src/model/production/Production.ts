import Product from "../Product";
import ProductCategories from "./ProductCategories";
import ProductionList from "./ProductionList";

abstract class Production<T extends ProductCategories, U extends Product> {
     category: T;
     product: U;
     value: number;
     productionList: ProductionList;
     id: number;


	constructor($category: T, $product: U, $value: number, $productionList: ProductionList, $id: number) {
		this.category = $category;
		this.product = $product;
		this.value = $value;
		this.productionList = $productionList;
		this.id = $id;
    }
    

    /**
     * Getter $product
     * @return {U}
     */
	public get $product(): U {
		return this.product;
	}


    /**
     * Getter $category
     * @return {T}
     */
	public get $category(): T {
		return this.category;
	}

    /**
     * Getter $value
     * @return {number}
     */
	public get $value(): number {
		return this.value;
	}
    

}
export default Production;