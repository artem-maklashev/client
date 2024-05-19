import ReportData from "../../../model/ReportData"
import Shift from "../../../model/Shift";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import ProductionList from "../../../model/production/ProductionList";
import { FetchData } from "./FetchingData";

const NewReport = () => {
    const productionList = new ProductionList(
        -1,
        new Date(),
        new Date(),
        new Date(),
        new Shift(),
        new GypsumBoard()
    );

    const productions = () => {
        const categoriesList = FetchData.
    }
    const newReport = new ReportData();
}
