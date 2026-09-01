import Material from "../Material";

export class AverageConsumptionComparison {
    material: Material;
    averageConsumption: number;
    currentConsumption: number;

    constructor(material: Material, averageConsumption: number, currentConsumption: number) {
        this.material = material;
        this.averageConsumption = averageConsumption;
        this.currentConsumption = currentConsumption;
    }

    // Тот самый статический метод для парсинга
    static fromJSON(obj: any): AverageConsumptionComparison {
        return new AverageConsumptionComparison(
            // Если Material это тоже класс, обязательно вызываем его fromJSON
            Material.fromJSON(obj.material), 
            obj.averageConsumption,
            obj.currentConsumption
        );
    }
}