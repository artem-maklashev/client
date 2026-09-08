import Specification from "../../../model/specification/Specification";
import { api } from "../../../service/Api";

export class ConsumptionApiService {
    private static baseUrl = process.env.REACT_APP_API_URL;

    static async updateSpecification(materialId: number, quantity: number, productId: number): Promise<Specification> {
        try {
            const responce = await api.put(`${this.baseUrl}/specifications/specification`, { materialId, quantity, productId });
            return responce.data;
        } catch (error) {
            console.log("Error updating specification");
            throw error;
        }
    }

    static async removeSpecification(materialId: number, productId: number): Promise<void> {
        try {
            await api.delete(`${this.baseUrl}/specifications/remove`, {
                params: { materialId, productId }
            });
        } catch (error) {
            console.error("Error removing specification", error);
            throw error;
        }
    }

    static async addSpecification(materialId: number, quantity: number, productId: number): Promise<Specification> {
        try {
            const responce = await api.post(`${this.baseUrl}/specifications/add`, { materialId, quantity, productId });
            return responce.data;
        } catch (error) {
            console.log("Error adding specification");
            throw error;
        }
    }
}