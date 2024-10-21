import { api } from "./Api";

class MixApiService {
    private static baseUrl = process.env.REACT_APP_API_URL + '/drymix';

    static async getAllMixes() {
        try {
            const responce = await api.get(`${this.baseUrl}/getAll`);
            return responce.data;
        } catch (error: any) {
            console.log(`Error in MixApiService.getAllMixes: ${error.message}`);
            throw error;
        }
    }

    static async getAllCategories() {
        try {
            const responce = await api.get(`${this.baseUrl}//mixcategory/getAll`);
            return responce.data;
        } catch (error: any) {
            console.log(`Error in MixApiService.getAllCategories: ${error.message}`);
            throw error;
        }
    }
}
export default MixApiService;