import ProductTypes from "../../../../model/ProductTypes";
import GypsumBoardCategory from "../../../../model/gypsumBoard/GypsumBoardCategory";
import { api } from "../../../../service/Api";

class FetchCategories {
    async getCategories() {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/gypsumCategories`);
            return (response.data as GypsumBoardCategory[]).sort((a, b) => a.id - b.id );
        } catch (error) {
            console.error('Ошибка при получении данных о категориях выпуска гипсокартона', error);
            throw error; // Вы можете обработать ошибку в компоненте, который использует этот класс
        }
    }
    async getProductionType() {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/getBoardType`);
            return response.data as ProductTypes;
        } catch (error) {
            console.error('Ошибка при получении объекта ProductTypes выпуска гипсокартона', error);
            throw error; // Вы можете обработать ошибку в компоненте, который использует этот класс
        }
    }
}
export default FetchCategories;