import Product from "./Product";
import Gypsum from "./gypsum/Gypsum";
import GypsumBoard from "./gypsumBoard/GypsumBoard";
import ProductCategories from "./production/ProductCategories";
import ProductCategoryMapEntry from "./production/ProductCategoryMapEntry";
import Production from "./production/Production";
import ProductionList from "./production/ProductionList";

class ReportData<T extends Product, U extends ProductCategories, V extends Production<U, T>> {
    productionList: ProductionList;
    product!: T;
    productions: V[];

    constructor(product: T,productionList: ProductionList, productions: V[]) {
        this.productionList = productionList;
        this.productions = productions;
        this.product = product;
        
        }
    }

export default ReportData;