import Product from "./Product";
import BoardDefectsLog from "./defects/BoardDefectsLog";
import AllDelays from "./delays/AllDalays";
import ProductCategories from "./production/ProductCategories";
import Production from "./production/Production";
import ProductionList from "./production/ProductionList";

class ReportData<T extends Product, U extends ProductCategories, V extends Production<U, T>, X extends AllDelays<T>> {
    
    productionList: ProductionList;
    product!: T;
    productions: V[];
    delays: X[];
    defectsLogs: BoardDefectsLog[];


    constructor(product: T, productionList: ProductionList, productions: V[], delays?: X[], defects?: BoardDefectsLog[]) {
        this.product = product;
        this.productionList = productionList;
        this.productions = productions;
        this.delays = delays || [];
        this.defectsLogs = defects || [];
    }

    /**
     * name
     */
    getProductName() {
        return this.product.toString();
    }

    updateProductions(production: V) : this{
        this.productions = this.productions.map((entry) => {
            if (entry.id === production.id) {
                return production; // обновляем производство
            } else {
                return entry; // возвращаем текущее производство, если оно не совпадает
            }
        });
        return this;
    }

    updateDelays(delay: X) : this {
        this.delays.map((entry) => {
            if (entry.id === delay.id) {
                return delay;
            } else {
                return entry;
            }
        });
        return this;
    }

    updateDefect(defect: BoardDefectsLog) {
        this.defectsLogs.map((entry) => {
            if (entry.id === defect.id) {
                return defect;
            } else {
                return entry;
            }
        });
        return this;
      }

}

export default ReportData;