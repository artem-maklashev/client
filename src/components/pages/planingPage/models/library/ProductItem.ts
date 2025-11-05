import Product from "../../../../../model/Product";

export class ProductItem {
    constructor(
            public id: number,
            public gypsumBoard: Product,
            public quantity: number, 
            public month: Date,
            public startProduction: Date,
            public endProduction: Date
        ) {} 
    }