import Plan from "../model/gypsumBoard/Plan";
import { api } from "./Api";
import BoardProduction from "../model/production/BoardProduction";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import GypsumBoard from "../model/gypsumBoard/GypsumBoard";
import Specification from "../model/specification/Specification";
import ProductionList from "../model/production/ProductionList";
import MaterialConsumption from "../model/specification/MaterialConsumption";
dayjs.extend(utc);


class ApiService {
    private static baseUrl = process.env.REACT_APP_API_URL;

    static async fetchTodayPlan(): Promise<Plan[]> {
        try {
            const response = await api.get(`${this.baseUrl}/planData`);
            return response.data;
        } catch (error: any) {
            console.error(`Произошла ошибка: ${error.message}`);
            throw error;
        }
    }

    static async fetchPlan(startDate: Date, endDate: Date): Promise<Plan[]> {
        try {
            const params = {
                // startDate: this.getFormattedDate(startDate),
                startDate: (startDate),
                // endDate: this.getFormattedDate(endDate)
                endDate: (endDate)
            };
            const response = await api.get(`${this.baseUrl}/planForThePeriod`, { params });
            return response.data;
        } catch (error: any) {
            console.error(`Произошла ошибка: ${error.message}`);
            throw error;
        }
    }

    static async fetchBoardProduction(startDate: Date, endDate: Date): Promise<BoardProduction[]> {
        try {
            const params = {
                startDate: (startDate),
                endDate: (endDate)
                // startDate: this.getFormattedDate(startDate),
                // endDate: this.getFormattedDate(endDate)
            };
            const response = await api.get(`${this.baseUrl}/allboard/production`, { params });
            return response.data;
        } catch (error: any) {
            console.error(`Произошла ошибка: ${error.message}`);
            throw error;
        }
    }


    static async fetchTodayBoardProduction(): Promise<BoardProduction[]> {
        try {
            const now = new Date();
            // const startDate = new Date(now.getFullYear(), now.getUTCMonth() + 1, 1);
            const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();



            const params = {
                startDate: startDate,
                endDate: new Date().toISOString()
            };
            const response = await api.get(`${this.baseUrl}/allboard/production`, { params });
            return response.data;
        } catch (error: any) {
            console.error(`Произошла ошибка: ${error.message}`);
            throw error;
        }
    }

    static async deleteReport(id: number): Promise<void> {
        try {
            // Отправляем DELETE-запрос на сервер
            const response = await api.delete(`${this.baseUrl}/boardProduction/${id}`);

            // Проверяем успешность ответа
            if (response.status === 200) {
                console.log('Отчет успешно удален');
            } else {
                console.error('Не удалось удалить отчет', response.statusText);
            }
        } catch (error) {
            // Обработка ошибки
            console.error('Ошибка при удалении записи', error);
        }
    }

    static getFormattedDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    static getFirstDate(): string {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getUTCMonth() + 1, 1);
        const year = firstDay.getUTCFullYear();
        const month = (firstDay.getUTCMonth() + 1).toString().padStart(2, '0');

        return `${year}-${month}-01`;
    }

    static getFormatedLocalDateFromDayjs(newValue: any): Date {
        if (dayjs.isDayjs(newValue)) {
            const formattedDate = dayjs(newValue).utc().local().format('YYYY-MM-DDTHH:mm');
            return (new Date(new Date(formattedDate).setSeconds(0)));
        } else {
            return (new Date(newValue));
        }
    }

    static removeTimeZone(date: Date) {
        const offset = date.getTimezoneOffset() * 60000;

        const dateMils = date.getTime();

        const newDate = new Date(dateMils - offset);
        console.log("Преобразуем: " + date + "\ngetTimezoneOffset: " + offset + "\ndateMils: " + dateMils + "\nПреобразованная дата: " + newDate);
        return newDate;
    }

    static async fetchSpecification(product: GypsumBoard): Promise<Specification[]> {
        try {
            const response = await api.post(`${this.baseUrl}/specifications/getSpecificationByProduct`, product);
            console.log("Получена спецификация \n" + response.data.toString());
            return response.data;

        } catch (error) {
            // Обработка ошибки
            console.error('Ошибка при получении спецификации', error);
            return [];
        }
    }

    static async fetchConsumption(productionList: ProductionList): Promise<MaterialConsumption[]> {
        try {
            const response = await api.post(`${this.baseUrl}/specifications/getConsumption`, productionList);
            console.log("Получены данные о расходе материалов");
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении расхода материалов', error);
            return [];
        }
    }

    static async fetchDelaysData(selectedStartDate: Date, selectedEndDate: Date) {
        try {
            const params = new URLSearchParams({
                startDate: this.getFormattedDate(selectedStartDate),
                endDate: this.getFormattedDate(selectedEndDate)
            });

            const response = await api.get(`${process.env.REACT_APP_API_URL}/allboard/delays?${params}`);

            return response.data;
            
        } catch (error: any) {
            console.error(`Произошла ошибка при получени  простоев: ${error.message}`);
            
        }
    }
}

export default ApiService;
