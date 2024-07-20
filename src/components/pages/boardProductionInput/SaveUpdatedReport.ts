import ReportData from "../../../model/ReportData";

import Delays from "../../../model/delays/Delays";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";
import BoardProduction from "../../../model/production/BoardProduction";
import { api } from "../../../service/Api";
import ApiService from './../../../service/ApiService';

export const saveUpdatedReport = async (updatedReport: ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>): Promise<void> => {
    console.log("======*****======");
    console.log(updatedReport);
    const formateDate = (date: Date)  => {
        // const newDate = new Date(date);
        // const offset = newDate.getTimezoneOffset()/60;
        // console.log("date: " + date + "\nnewDate: " + newDate + "\noffset: " + offset);
        // return new Date(newDate.setHours(newDate.getHours() - offset));
        return new Date(date.toLocaleString());
    }

    //  updatedReport.productionList.productionFinish = formateDate(updatedReport.productionList.productionFinish);
    //  updatedReport.productionList.productionStart = formateDate(updatedReport.productionList.productionStart);
    //  updatedReport.delays.forEach((delay) => {
    //     delay.startTime = formateDate(delay.startTime);
    //     delay.endTime = formateDate(delay.endTime);
    //  })

    try {    
        const newStartDate =  ApiService.removeTimeZone(updatedReport.productionList.productionStart)   
        console.log('Sending startdate: ' + newStartDate);
        console.log('Sending enddate: ' + updatedReport.productionList.productionFinish);
        // Отправляем обновленный отчет на сервер
        const response = await api.put(`${process.env.REACT_APP_API_URL}/boardProduction`, updatedReport);
        console.log('Report updated successfully:', response.data);
    } catch (error) {
        console.error('Failed to save report', error);
        // Пробрасываем ошибку дальше
        throw error;
    }
};


