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

    async addDrywallItem(drywallItemDTO: DrywallItem) {
        if (drywallItemDTO) {
            try {
                const responce = await api.put(`${process.env.REACT_APP_API_URL}/planing/addDrywallItem`, drywallItemDTO);                                
                return  DrywallItem.fromJSON(responce.data);                    
                ;
            } catch (error: any) {
                console.error(`Произошла ошибка при сохранении данных по планированию`, error);
                throw error; // Пробрасываем ошибку выше, чтобы вызывающий код мог обработать её правильно
            }
        }
    }

    async deleteDrywallItem(id: number) {
        try {
            return await api.delete(`${process.env.REACT_APP_API_URL}/planing/deleteDrywallItem/${id}`);
        } catch (error: any) {
            console.error(`Произошла ошибка при удалении данных по планированию`, error);
            throw error; // Пробрасываем ошибку выше, чтобы вызывающий код мог обработать е
        }
    }

    async updateDrywallItem(drywallItemDTO: DrywallItem) {
        if (drywallItemDTO) {
            try {
                const responce = await api.put(`${process.env.REACT_APP_API_URL}/planing/updateDrywallItem`, drywallItemDTO);                
                return  DrywallItem.fromJSON(responce.data);                    
                ;
            } catch (error: any) {
                console.error(`Произошла ошибка при сохранении данных по планированию`, error);
                throw error; // Пробрасываем ошибку выше, чтобы вызывающий код мог обработать е
            }
        }
    }

}