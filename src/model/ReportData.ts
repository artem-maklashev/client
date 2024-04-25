import Product from "./Product";
import BoardProduction from "./production/BoardProduction";
import ProductCategoryMapEntry from "./production/ProductCategoryMapEntry";
import ProductionList from "./production/ProductionList";

export class ReportData {
    productionList: ProductionList;
    product!: Product;
    productCategories: ProductCategoryMapEntry[];

    constructor(productionList: ProductionList, boardProductionsOrGypsumProductions: BoardProduction[]) {// | GypsumProduction[]) {
        this.productionList = productionList;
        this.productCategories = [];
        
        if (boardProductionsOrGypsumProductions.length > 0) {
            const firstProduction = boardProductionsOrGypsumProductions[0];
            if (firstProduction instanceof BoardProduction) {
                this.product = firstProduction.gypsumBoard;
                for (const boardProduction of boardProductionsOrGypsumProductions as BoardProduction[]) {
                    this.productCategories.push(new ProductCategoryMapEntry(boardProduction.gypsumBoardCategory, boardProduction.value));
                }
                // } else if (firstProduction instanceof GypsumProduction) {
                //     this.product = firstProduction.gypsum;
                //     for (const gypsumProduction of boardProductionsOrGypsumProductions as GypsumProduction[]) {
                //         this.productCategories.push(new ProductCategoryMapEntry(gypsumProduction.gypsumCategory, gypsumProduction.value));
                //     }
                // }
            }
        }
    
        // static createFromBoardProductions(productionList: ProductionList, boardProductions: BoardProduction[]): ReportData {
        //     return new ReportData(productionList, boardProductions);
        // }

        // static createFromGypsumProductions(productionList: ProductionList, gypsumProductions: GypsumProduction[]): ReportData {
        //     return new ReportData(productionList, gypsumProductions);
        // }
    }
}
export default ReportData;