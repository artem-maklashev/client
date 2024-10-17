import MixCategory from "./MixCategory";
import MixProduction from "./MixProduction";

class MixCategoryProduction {
    id: number;
    production: MixProduction;
    category: MixCategory;
    constructor(id: number, production: MixProduction, category: MixCategory) {
        this.id = id;
        this.production = production;
        this.category = category;
    }
}
export default MixCategoryProduction;