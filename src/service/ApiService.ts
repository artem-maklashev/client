import Plan from "../model/gypsumBoard/Plan";
import { api } from "./Api";
import BoardProduction from "../model/production/BoardProduction";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import GypsumBoard from "../model/gypsumBoard/GypsumBoard";
import Specification from "../model/specification/Specification";
import ProductionList from "../model/production/ProductionList";
import MaterialConsumption from "../model/specification/MaterialConsumption";
import { addDays } from "date-fns";
import { format, fromZonedTime, toZonedTime } from "date-fns-tz";
import Material from "../model/specification/Material";
dayjs.extend(utc);


class ApiService {
    private static baseUrl = process.env.REACT_APP_API_URL;
    private static plusDays = Number(process.env.REACT_APP_PLUS_DAYS);

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
                startDate: this.formatDateToISO(startDate),//addDays(startDate, this.plusDays),
                // endDate: this.getFormattedDate(endDate)
                endDate: this.formatDateToISO(endDate)//addDays(endDate, this.plusDays)
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
                startDate: this.formatDateToISO(startDate) ,
                endDate: this.formatDateToISO(endDate)
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
        const now = new Date();
        // const startDate = new Date(now.getFullYear(), now.getUTCMonth() + 1, 1);
        const startDate = (new Date(now.getFullYear(), now.getMonth(), 1))
        console.error("Дата наачала запроса выпуска на сегодня:" + startDate);
        console.error("Преобразованная дата начала будет:" + this.formatDateToISO(startDate));

        const params = {
            startDate: this.formatDateToISO(startDate) ,
                endDate: this.formatDateToISO(now)
        };

        try {

            const response = await api.get(`${this.baseUrl}/allboard/production`, { params });
            return response.data;
        } catch (error: any) {
            console.error(`Произошла ошибка: ${error.message}`);
            throw error;
        }
    }

    static async fetchBoardProductionByGypsumBoardAndDate(gypsumBoard: GypsumBoard, startDate: Date, endDate: Date): Promise<BoardProduction[]> {
        const requestBody = {
            gypsumBoard,  // объект GypsumBoard
            startDate: this.formatDateToISO(startDate),  // форматирование даты в ISO
            endDate: this.formatDateToISO(endDate)  // форматирование конечной даты
          }
        try {
            const response = await api.post(`${this.baseUrl}/boardProductionsByGypsumBoard`,  requestBody);
            return response.data;

        } catch (error: any) {
            console.error(`Произошла ошибка при отправке запроса получения выпусков по дате и виду гипсокартона: ${error.message}`);
            throw error;

        }
    }

    static async fetchConsumptionsByDateAndMaterial(startDate: Date, endDate: Date, materialId: number) {
        try {
            const params = {
                startDate: this.formatDateToISO(startDate) ,
                endDate: this.formatDateToISO(endDate),
                materialId: materialId
            };
            const response = await api.get(`${this.baseUrl}/specifications/getConsumptionByDate`, { params });
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

    static formatDateToISO(date: Date) {
        const timeZone = 'Europe/Samara';
        const zonedDate = toZonedTime(date, timeZone);
        return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { timeZone });
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
            console.log("Получена спецификация \n" + JSON.stringify(response.data));
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
            // selectedStartDate = addDays(selectedStartDate, 1 + this.plusDays);
            // selectedEndDate = addDays(selectedEndDate, 1 + this.plusDays);

            const params = new URLSearchParams({
                startDate: this.formatDateToISO(selectedStartDate).split('T')[0],
                endDate: this.formatDateToISO(selectedEndDate).split('T')[0]
            });

            const response = await api.get(`${process.env.REACT_APP_API_URL}/allboard/delays?${params}`);

            return response.data;

        } catch (error: any) {
            console.error(`Произошла ошибка при получени  простоев: ${error.message}`);

        }
    }

    static async fetchReports(selectedDate: Date) {
        try {
            // selectedStartDate = addDays(selectedStartDate, 1 + this.plusDays);
            // selectedEndDate = addDays(selectedEndDate, 1 + this.plusDays);

            const params = new URLSearchParams({
                date: this.formatDateToISO(selectedDate)              
            });

            const response = await api.get(`${process.env.REACT_APP_API_URL}/boardProductionsByDate?${params}`);

            return response.data;

        } catch (error: any) {
            console.error(`Произошла ошибка при поиске отчетов за дату ${selectedDate}: ${error.message}`);

        }
    }

    static async fetchGypsumBoards() {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/gypsumBoard`);
            return response.data;
        } catch (error: any){
            console.error(`Произошла ошибка при получении списка ГСП`);
        }
    }

    static async fetchMaterials() {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/materials/getAll`);
            return response.data;
        } catch (error: any){
            console.error(`Произошла ошибка при получении списка материалов`);
        }
    }

    static getName(gboard: GypsumBoard){
        return (
          gboard.tradeMark.name +
          " тип " +
          gboard.boardType.name +
          " " +
          gboard.edge.name +
          "-" +
          gboard.thickness.value +
          "-" +
          gboard.width.value +
          "-" +
          gboard.length.value
        );
      };
}

export default ApiService;
