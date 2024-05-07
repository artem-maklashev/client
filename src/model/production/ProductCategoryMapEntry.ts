import ProductCategories from "./ProductCategories";

class ProductCategoryMapEntry <T extends ProductCategories>{
    category: T;
    value: number;

    constructor(category: T, value: number) {
        this.category = category;
        this.value = value;
    }
}
export default ProductCategoryMapEntry;