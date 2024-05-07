import BoardDefectsLog from "../../../model/defects/BoardDefectsLog";
import BoardProduction from "../../../model/production/BoardProduction";
import DefectChartData from "../gypsumBoardElements/DefectChartData";


class ProductionByShift {
    total: number;
    goodProduct: number;

    constructor(total: number, goodProduct: number) {
        this.total = total;
        this.goodProduct = goodProduct;
    }
}

class DefectsDataPrepare {
    defectsData: BoardDefectsLog[];
    productionData: BoardProduction[];

    constructor(defectsData: BoardDefectsLog[], productionData: BoardProduction[]) {
        this.defectsData = defectsData;
        this.productionData = productionData;
    }


    getSummary() {
        const defectSummary: { [key: string]: number } = {};

        this.defectsData.forEach((item) => {
            const defectType = item.defects.defectTypes.name;

            if (!defectSummary[defectType]) {
                defectSummary[defectType] = 0;
            }
            defectSummary[defectType] += item.value;
        });

        const sortedEntries = Object.entries(defectSummary).sort((a, b) => b[1] - a[1]);

        const sortedSummary: { [key: string]: number } = {};
        sortedEntries.forEach(([key, value], index) => {
            sortedSummary[key] = value;
        });

        return sortedSummary;
    }

    getProductionDict() {
        const productionDict: { [shift: string]: ProductionByShift } = {};
        this.productionData.forEach(production => {
            const shiftName: string = (production.productionList.shift && production.productionList.shift.name) || 'Unknown Shift';
            if (!productionDict[shiftName]) {
                productionDict[shiftName] = new ProductionByShift(0, 0);
            }

            if (production.category.id === 1) {
                productionDict[shiftName].total += production.value;
            } else if (production.category.id > 1 && production.category.id < 5) {
                productionDict[shiftName].goodProduct += production.value;
            }
        });
        return productionDict;
    }

    getCategorySummary() {
        const categorySummary: { [categoryName: string]: number } = {};
        this.productionData.forEach(production => {
            const shiftName: string = (production.productionList.shift && production.productionList.shift.name) || 'Unknown Shift';
            const categoryName = production.category.title;
            if (production.category.id > 4 ) {
                if (!categorySummary[categoryName]) {
                    categorySummary[categoryName] = 0;
                }
                categorySummary[categoryName] += production.value;
            }
        });
        return categorySummary;
    }

    getDefectsByDate() {
        const defectsByDate: DefectChartData[] = [];
        this.productionData.forEach(production => {
            if (production.category.id < 5) {
                const existingData = defectsByDate.find((item) => {
                    return item.pDate === production.productionList.productionDate;
                });
            
                if (existingData) {
                    // Если данные существуют, добавьте значение к существующему значению
                    if (production.category.id > 1 && production.category.id < 5) {
                        existingData.value += production.value;
                    } else
                        existingData.totalValue += production.value;
                } else {
                // Если данных нет, создайте новый объект ChartData и добавьте его в массив
                let newData: DefectChartData;
                    if (production.category.id === 2 || production.category.id === 3 || production.category.id === 4) {
                    newData = new DefectChartData(production.productionList.productionDate, production.value, 0, 0);
                } else {
                    newData = new DefectChartData(production.productionList.productionDate, 0, production.value, 0);
                }
                defectsByDate.push(newData);
            }            
        }
        });
        return defectsByDate;
    }
}

export default DefectsDataPrepare;