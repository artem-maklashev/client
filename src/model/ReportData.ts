import Product from "./Product";
import Gypsum from "./gypsum/Gypsum";
import GypsumBoard from "./gypsumBoard/GypsumBoard";
import ProductCategories from "./production/ProductCategories";
import ProductCategoryMapEntry from "./production/ProductCategoryMapEntry";
import Production from "./production/Production";
import ProductionList from "./production/ProductionList";

class ReportData<T extends Product, U extends ProductCategories> {
    productionList: ProductionList;
    product!: T;
    productCategories: ProductCategoryMapEntry<U>[];

    constructor(productionList: ProductionList, productions: Production<U, T>[]) {
        this.productionList = productionList;
        this.productCategories = [];

        for (const production of productions) {
            const prod = production.$product;
            if (prod instanceof GypsumBoard) {
                this.product = prod;
                const mapEntry: ProductCategoryMapEntry<U> = {
                    category: production.$category,
                    value: production.$value
                };
                this.productCategories.push(mapEntry);
            } else if (prod instanceof Gypsum) {
                this.product = prod;
                const mapEntry: ProductCategoryMapEntry<U> = {
                    category: production.$category,
                    value: production.$value
                };
                this.productCategories.push(mapEntry);
            }
        }
    }
}
export default ReportData;