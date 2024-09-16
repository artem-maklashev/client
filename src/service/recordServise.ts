import { api, getUserId } from "./Api";

class RecordService {
    private static baseUrl = process.env.REACT_APP_API_URL;

    static async checkRecordLock(recordId: number): Promise<boolean> {

        const response = await api.get(`${this.baseUrl}`);

        if (response.status === 200) {
            return true;
        } else {
            const errorMessage = await response.data;
            console.log(errorMessage);
            return false; // Запись заблокирована
        }
    }

    static async lockRecord(recordId: number, userId: string): Promise<boolean> {

        const responseBody = {
            recordId: recordId.toString(),
            //получить данные пользователя
            userId: getUserId()
        }

        const response = await api.post(`${this.baseUrl}`, responseBody);

        if (response.status === 200) {
            return true; // Запись успешно заблокирована
        } else {
            const errorMessage = await response.data;
            console.log(errorMessage);
            return false; // Не удалось заблокировать
        }
    }

    static async openRecord(recordId: number, userId: string) {
        const isAvailable = await this.checkRecordLock(recordId);

        if (isAvailable) {
            const isLocked = await this.lockRecord(recordId, userId);

            if (isLocked) {
                console.log('Запись успешно открыта и заблокирована для других пользователей');
                // Открываем запись для редактирования
            } else {
                console.log('Не удалось заблокировать запись');
            }
        } else {
            console.log('Запись уже заблокирована другим пользователем');
        }
    }

    //Метод разблокировки записи
    
}