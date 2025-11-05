import { ProductItem } from "./ProductItem";

export class ProductNode {
    constructor(
        public item: ProductItem,
        public next: ProductNode | null = null,
        public prev: ProductNode | null = null
    ){}
}