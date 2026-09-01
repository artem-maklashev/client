import GypsumBoard from "../../gypsumBoard/GypsumBoard";
import { AverageConsumptionComparison } from "./AverageConsumptionComparison";

export class ProductAverageConsumption {
    gypsumBoard: GypsumBoard;
    averageConsumptionComparisons: AverageConsumptionComparison[];
    constructor(
        gypsumBoard: GypsumBoard, averageConsumptions: AverageConsumptionComparison[]) {
            this.gypsumBoard = gypsumBoard;
            this.averageConsumptionComparisons = averageConsumptions;
        }

    fromJSON(json: any): ProductAverageConsumption {
        return new ProductAverageConsumption(
            GypsumBoard.fromJSON(json.gypsumBoard),
            json.averageConsumptions.map((averageConsumption: any) => 
                AverageConsumptionComparison.fromJSON(averageConsumption))
        );
    }
}
