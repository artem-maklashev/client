import Plan from "../model/gypsumBoard/Plan";
import {api} from "./Api";
import BoardProduction from "../model/production/BoardProduction";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
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

    static async fetchTodayBoardProduction(): Promise<BoardProduction[]> {
        try {
            const now = new Date();
            // const startDate = new Date(now.getFullYear(), now.getUTCMonth() + 1, 1);
            const startDate = this.getFirstDate();



            const params = {
                startDate: startDate,
                endDate: this.getFormattedDate(now)
            };
            const response = await api.get(`${this.baseUrl}/allboard/production`, { params });
            return response.data;
        } catch (error: any) {
            console.error(`Произошла ошибка: ${error.message}`);
            throw error;
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
            const formattedDate = dayjs(newValue).utc().local().format('YYYY-MM-DDTHH:mm:ss');
            return (new Date(formattedDate));
          } else {
            return (new Date(newValue));
          }
    }
}

export default ApiService;
