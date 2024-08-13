
import Delays from "../../../model/delays/Delays";





class DelayDataPrepare {

    delaysData: Delays[];

    constructor(data: Delays[]) {
        this.delaysData = data;
    }

    getSummary() {
        const delaysSummary: { [key: string]: number } = {};
        const unitData: { [key: string]: Delays[] } = {};
        if (this.delaysData) {
            this.delaysData.forEach((item) => {
                const delayType = item.delayType.name;
                const unitName = item.unitPart.unit.name;
                const deltaTime =
                    (new Date(item.endTime).getTime() - new Date(item.startTime).getTime()) /
                    (60 * 1000);

                if (!unitData[delayType]) {
                    unitData[delayType] = [];
                }

                // Ищем элемент с таким же unit в текущем типе простоя
                const existingItem = unitData[delayType].find(
                    (existing) => existing.unitPart.unit.name === unitName
                );

                if (existingItem) {
                    // Если найден, суммируем длительность
                    existingItem.delta += deltaTime;
                } else {
                    // Если не найден, добавляем новый элемент
                    unitData[delayType].push({ ...item, delta: deltaTime });
                }

                // Инициализация суммарного времени для данного типа простоя
                if (!delaysSummary[delayType]) {
                    delaysSummary[delayType] = 0;
                }

                // Обновление суммарного времени для данного типа простоя
                delaysSummary[delayType] += deltaTime;
            });
        }
        Object.values(unitData).forEach((item) => item.sort((a, b) => a.delta > b.delta ? -1 : 1));
        return { delaysSummary, unitData };
    }

}

export default DelayDataPrepare;