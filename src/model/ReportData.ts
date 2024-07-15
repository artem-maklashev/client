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


    constructor(
        productOrReportData: T | ReportData<T, U, V, X>,
        productionList?: ProductionList,
        productions?: V[],
        delays?: X[],
        defects?: BoardDefectsLog[]
    ) {
        if (productOrReportData instanceof ReportData) {
            // Если передан объект ReportData, копируем его свойства
            this.product = productOrReportData.product;
            this.productionList = { ...productOrReportData.productionList };
            this.productions = productOrReportData.productions.map(p => ({ ...p }));
            this.delays = productOrReportData.delays.map(d => ({ ...d }));
            this.defectsLogs = productOrReportData.defectsLogs.map(dl => ({ ...dl }));
        } else {
            // Если переданы отдельные параметры, инициализируем свойства напрямую
            this.product = productOrReportData;
            this.productionList = productionList!;
            this.productions = productions || [];
            this.delays = delays || [];
            this.defectsLogs = defects || [];
        }
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