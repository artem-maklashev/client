import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";

export class DrywallItem {
    constructor(
        public id: number,
        public gypsumBoard: GypsumBoard,
        public quantity: number
    ) {}
}