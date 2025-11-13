import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import { ProductItem } from "./library/ProductItem";

export class DrywallItem extends ProductItem {
    constructor(
        public id: number,
        public product: GypsumBoard,
        public quantity: number,
        public month: Date,
        public startProduction: Date,
        public endProduction: Date
    ) {
        super(id,product,quantity,
            month, startProduction, endProduction);
    }

    splitItem(newQuantity: number): [ firstPart: DrywallItem, secondPart: DrywallItem ] {
        if (newQuantity >= this.quantity || newQuantity <= 0) {
            throw new Error("New quantity must be greater than 0 and less than the current quantity.");
        }

        const remainingQuantity = this.quantity - newQuantity;

        const firstPart = new DrywallItem(
            this.id, 
            this.product,
            newQuantity,
            new Date(this.month),
            this.startProduction,
            this.endProduction
        );

        const secondPart = new DrywallItem(
            -1, 
            this.product,
            remainingQuantity,
            new Date(this.month),
            this.startProduction,
            this.endProduction
        );

        return [firstPart, secondPart];
    }

    static fromJSON(obj: any) {
             return new DrywallItem(
          obj.id,
          GypsumBoard.fromJSON(obj.product),
          obj.quantity,
          new Date(obj.month),
          new Date(obj.startProduction),
          new Date(obj.endProduction)
        );
      }
}