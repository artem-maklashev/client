import DefectReason from "../../../../model/defects/DefectReason";
import DefectTypes from "../../../../model/defects/DefectTypes";
import Defects from "../../../../model/defects/Defects";
import { api } from "../../../../service/Api";

class FetchDefectData {
    async getDefectTypes() {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/defectTypes`);
            return response.data as DefectTypes[];
        } catch (error) {
            console.error('Ошибка при получении данных о типах дефекта', error);
            throw error; // Вы можете обработать ошибку в компоненте, который использует этот класс
        }
    }
    async getDefectReason() {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/defectReason`);
            return response.data as DefectReason[];
        } catch (error) {
            console.error('Ошибка при получении данных о причинах дефекта', error);
            throw error; // Вы можете обработать ошибку в компоненте, который использует этот класс
        }
    }
    async getDefects(defectReasonId: number, defectTypeId: number) {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/defects/${defectReasonId}?defectTypeId=${defectTypeId}`);
            return response.data as Defects[];
        } catch (error) {
            console.error('Ошибка при получении данных о дефектах ', error);
            throw error; // Вы можете обработать ошибку в компоненте, который использует этот класс
        }
    }


}
export default FetchDefectData;