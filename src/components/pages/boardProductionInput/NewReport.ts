import ProductTypes from "../../../model/ProductTypes";
import ReportData from "../../../model/ReportData"
import Shift from "../../../model/Shift";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import BoardProduction from "../../../model/production/BoardProduction";
import ProductionList from "../../../model/production/ProductionList";
import FetchCategories from "./FetchCategories";

const NewReport = async () => {
    const fetcher = new FetchCategories();

    const productionList = new ProductionList(
        -1,
        new Date(),
        new Date(),
        new Date(),        
        new Shift(),
        new ProductTypes(1, "ГСП")
    );

    const fetchProductions =async  () => {
        const categoriesList =await fetcher.getCategories().then(categories => {           
            const productions: BoardProduction[] = [];
            categories.forEach(category => {
                productions.push(new BoardProduction(-1, productionList, new GypsumBoard(), category, 0))
            })
            return productions.sort((a,b) => a.category.id - b.category.id);        });

        

        return categoriesList
    }

    const productions = await fetchProductions();
    
    return new ReportData(new GypsumBoard(), productionList, productions);
}
export default NewReport;