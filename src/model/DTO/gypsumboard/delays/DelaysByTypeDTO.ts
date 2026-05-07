import Delays from "../../../delays/Delays";

export class DelaysByTypeDTO {
    date: string;
    totalTime: number;
    delayTypes: Record<string, number>;
    delaysList: Delays[];

     constructor(date: string = '', totalTime: number = 0, delayTypes: Record<string, number> = {}, delaysList: Delays[] = []) {
        this.date = date;
        this.totalTime = totalTime;
        this.delayTypes = delayTypes;
        this.delaysList = delaysList;
    }

    // Статический метод для создания из JSON
    static fromJSON(json: any): DelaysByTypeDTO {
        // Безопасное чтение полей с значениями по умолчанию
        const date = json?.date ?? '';
        const totalTime = json?.totalTime != null ? Number(json.totalTime) : 0;
        let delayTypes: Record<string, number> = {};

        if (json?.delayTypes && typeof json.delayTypes === 'object') {
            // Преобразуем значения в числа на случай, если пришли строки
            delayTypes = Object.entries(json.delayTypes).reduce((acc, [key, value]) => {
                acc[key] = typeof value === 'number' ? value : Number(value) || 0;
                return acc;
            }, {} as Record<string, number>);
        }

        const delaysList = json?.delaysList ?? [];

        return new DelaysByTypeDTO(date, totalTime, delayTypes, delaysList);
    }

    // Сеттер для delayTypes
    public setDelaysByType(delaysByType: Record<string, number>): void {
        this.delayTypes = delaysByType;
    }

    // Геттер для date (если нужен)
    public getDate(): string {
        return this.date;
    }

    // Сеттер для date (если нужен)
    public setDate(date: string): void {
        this.date = date;
    }

    // Геттер для totalTime
    public getTotalTime(): number {
        return this.totalTime;
    }

    // Сеттер для totalTime
    public setTotalTime(totalTime: number): void {
        this.totalTime = totalTime;
    }

    // Удобный метод для получения значения по ключу
    public getDelayDuration(typeName: string): number {
        return this.delayTypes?.[typeName] ?? 0;
    }

    // Добавление времени к общему времени
    public addTotalTime(time: number): void {
        this.totalTime += time;
    }

    // Получение копии карты delayTypes (если нужна)
    public getDelayTypes(): Record<string, number> {
        return { ...this.delayTypes };
    }

    public getDelaysList(): Delays[] {
        return this.delaysList;
    }
}