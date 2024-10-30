import MixCategory from "./MixCategory";
import MixProduction from "./MixProduction";

class MixCategoryProduction {
    id: number;
    production: MixProduction;
    category: MixCategory;
    quantity: number;

    constructor(id: number, production: MixProduction, category: MixCategory, quantity: number) {
        this.id = id;
        this.production = production;
        this.category = category;
        this.quantity = quantity;
    }
}
export default MixCategoryProduction;