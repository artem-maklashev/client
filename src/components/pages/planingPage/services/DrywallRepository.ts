import { api } from "../../../../service/Api";
import ApiService from "../../../../service/ApiService";
import { DrywallItem } from "../models/DrywallItem";

export class DrywallRepository {
    
    private static baseUrl = process.env.REACT_APP_API_URL;

    async getAll(): Promise<DrywallItem[]> {
        try {
              const response = await api.get(`${DrywallRepository.baseUrl}/planing/getAll`);
              return response.data.map(DrywallItem.fromJSON);
            } catch (error: any) {
              console.error(`Произошла ошибка при получении списка ГСП:`, error);
              throw error; // Пробрасываем ошибку выше, чтобы вызывающий код мог обработать её правильно
            }
    }

    async getDrywallItemsByMonth
        (month: Date): Promise<DrywallItem[]> {
        try {
            const params = {
                month: ApiService.formatDateToISO(month),
            };
            const response = await api.get(`${DrywallRepository.baseUrl}/planing/getDrywallItemsByMonth`, { params });
            return response.data.map(DrywallItem.fromJSON);
        } catch (error: any) {
            console.error(`Произошла ошибка при получении списка ГСП:`, error);
            throw error; // Пробрасываем ошибку выше, чтобы вызывающий код мог обработать её правильно
        }
    }

}