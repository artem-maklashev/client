import ReportData from "../../../model/ReportData";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";
import { api } from "../../../service/Api";

export const saveUpdatedReport = async (updatedReport: ReportData<GypsumBoard, GypsumBoardCategory>): Promise<void> => {
    try {
        // Отправляем обновленный отчет на сервер
        const response = await api.put(`${process.env.REACT_APP_API_URL}/boardProduction`, updatedReport);
        console.log('Report updated successfully:', response.data);
    } catch (error) {
        console.error('Failed to save report', error);
        // Пробрасываем ошибку дальше
        throw error;
    }
};


