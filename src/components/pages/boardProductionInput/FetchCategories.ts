import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";
import { api } from "../../../service/Api";

class FetchCategories {
    async getCategories() {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/gypsumCategories`);
            return response.data as GypsumBoardCategory[];
        } catch (error) {
            console.error('Ошибка при получении данных о категориях выпуска гипсокартона', error);
            throw error; // Вы можете обработать ошибку в компоненте, который использует этот класс
        }
    }
}
export default FetchCategories;