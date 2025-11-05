import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import { ProductItem } from "./library/ProductItem";

export class DrywallItem extends ProductItem {
    constructor(
        public id: number,
        public gypsumBoard: GypsumBoard,
        public quantity: number,
        public month: Date,
        public startProduction: Date,
        public endProduction: Date
    ) {
        super(id,gypsumBoard,quantity,
            month, startProduction, endProduction);
    }

    splitItem(newQuantity: number): { firstPart: DrywallItem; secondPart: DrywallItem } {
        if (newQuantity >= this.quantity || newQuantity <= 0) {
            throw new Error("New quantity must be greater than 0 and less than the current quantity.");
        }

        const remainingQuantity = this.quantity - newQuantity;

        const firstPart = new DrywallItem(
            this.id, // можно оставить тот же ID или сгенерировать новый
            this.gypsumBoard,
            newQuantity,
            this.month,
            this.startProduction,
            this.endProduction
        );

        const secondPart = new DrywallItem(
            Date.now(), // или использовать UUID, если нужен уникальный ID
            this.gypsumBoard,
            remainingQuantity,
            this.month,
            this.startProduction,
            this.endProduction
        );

        return { firstPart, secondPart };
    }
}