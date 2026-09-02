import GypsumBoard from "../../gypsumBoard/GypsumBoard";
import Shift from "../../Shift";
import { AverageConsumptionComparison } from "./AverageConsumptionComparison";

export class ProductAverageConsumption {
    gypsumBoard: GypsumBoard;
    shift: Shift;
    averageConsumptionComparisons: AverageConsumptionComparison[];
    constructor(
        gypsumBoard: GypsumBoard, shift: Shift,averageConsumptions: AverageConsumptionComparison[]) {
            this.gypsumBoard = gypsumBoard;
            this.shift = shift;
            this.averageConsumptionComparisons = averageConsumptions;
        }

    static fromJSON(json: any): ProductAverageConsumption {
        return new ProductAverageConsumption(
            GypsumBoard.fromJSON(json.gypsumBoard),
            Shift.fromJSON(json.shift),
            json.averageConsumptionComparisons.map((averageConsumption: any) => 
                AverageConsumptionComparison.fromJSON(averageConsumption))
        );
    }
}
