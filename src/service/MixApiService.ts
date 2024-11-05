import DryMix from "../model/mix/DryMix";
import MixPlan from "../model/mix/plan";
import { api } from "./Api";
import ApiService from "./ApiService";

class MixApiService {

  private static baseUrl = process.env.REACT_APP_API_URL + '/drymix';

  static async getPlan(period: Date) {
    const start = new Date(period.getFullYear(), period.getMonth(), 1);
    const end = new Date(period.getFullYear(), period.getMonth() + 1, 0);
    const params = {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
    try {
      const response = await api.get(`${this.baseUrl}/plan/getPlan`, {
        params,
      });
      return response.data;
    } catch (error: any) {
      console.log(`Error in MixApiService.getPlan: ${error.message}`);
      throw error;
    }
  }

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

  static async MixList() {
    try {
      const responce = await api.get(`${this.baseUrl}/getAll`);
      return responce.data;
    } catch (error: any) {
      console.log(`Error in MixApiService.MixList: ${error.message}`);
      throw error;
    }
  }

  static async upsertMixPlan(mixPlan: MixPlan) {
    try {
      const responce = await api.put(`${this.baseUrl}/plan/updatePlan`, mixPlan);
      return responce.data;
    } catch (error: any) {
      console.log(`Error in MixApiService.upsertMix: ${error.message}`);
      throw error;
    }
  }

  static async deleteMixPlan(mixPlan: MixPlan) {
    const id = mixPlan.id;
    try {
      const responce = await api.delete(`${this.baseUrl}/plan/deletePlan/${id}`);
      return responce.data;
    } catch (error: any) {
      console.log(`Error in MixApiService.deleteMix: ${error.message}`);
      throw error;
    }
  }
  static async getProductionByDateBeetvean(startDate: Date, endDate: Date) {
    return [];
  }

  static async getPlanByDateBeetvean(startDate: Date, endDate: Date) {
    try {
      const params = {
        // startDate: this.getFormattedDate(startDate),
        startDate: ApiService.formatDateToISO(startDate),//addDays(startDate, this.plusDays),
        // endDate: this.getFormattedDate(endDate)
        endDate: ApiService.formatDateToISO(endDate)//addDays(endDate, this.plusDays)
      };
      const response = await api.get(`${this.baseUrl}/plan/getPlan`, { params });
      return response.data;
    } catch (error: any) {
      console.error(`Произошла ошибка: ${error.message}`);
      throw error;
    }
  }

  static async getLast10Productions() {
    try {
      const response = await api.get(`${this.baseUrl}/production/getLast10Productions`);
      return response.data;
    } catch (error: any) {
      console.error(`Произошла ошибка: ${error.message}`);
      throw error;
    }
  }

  static async getLast10Plans() {
    try {
      const response = await api.get(`${this.baseUrl}/production/getLast10Plans`);
      return response.data;
    } catch (error: any) {
      console.log(`Error in MixApiService.getLast10Plans: ${error.message}`);
      throw error;
    }
  }
}
export default MixApiService;