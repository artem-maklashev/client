import ProductCategories from "./ProductCategories";

class ProductCategoryMapEntry {
    category: ProductCategories;
    value: number;

    constructor(category: ProductCategories, value: number) {
        this.category = category;
        this.value = value;
    }
}
export default ProductCategoryMapEntry;