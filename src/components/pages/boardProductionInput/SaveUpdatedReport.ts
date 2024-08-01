import ReportData from "../../../model/ReportData";

import Delays from "../../../model/delays/Delays";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";
import BoardProduction from "../../../model/production/BoardProduction";
import MaterialConsumption from "../../../model/specification/MaterialConsumption";
import { api } from "../../../service/Api";
import ApiService from './../../../service/ApiService';

export const saveUpdatedReport = async (updatedReport: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>): Promise<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>> => {
    console.log("======*****======");
    console.log(updatedReport);

    try {
        const newStartDate = ApiService.removeTimeZone(updatedReport.productionList.productionStart)
        console.log('Sending startdate: ' + newStartDate);
        console.log('Sending enddate: ' + updatedReport.productionList.productionFinish);
        // Отправляем обновленный отчет на сервер
        const response = await api.put(`${process.env.REACT_APP_API_URL}/boardProduction`, updatedReport);
        console.log('Report updated successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to save report', error);
        // Пробрасываем ошибку дальше
        throw error;
    }
};

export const saveConsumptions = async (updatedConsumptions: MaterialConsumption[]) => {
    console.log("======*****======");
    console.log(updatedConsumptions);

    try {
        
        // Отправляем обновленный расход на сервер
        const response = await api.put(`${process.env.REACT_APP_API_URL}/specifications/updateConsumptions`, updatedConsumptions);
        console.log('Consumptions updated successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to save consumptions', error);
        // Пробрасываем ошибку дальше
        throw error;
    }
};
