import Product from "../Product";
import TradeMark from "../TradeMark";
import ProductTypes from "../ProductTypes";
import BoardType from "./BoardType";
import Edge from "./Edge";
import Length from "./Length";
import Thickness from "./Thickness";
import Width from "./Width";


class GypsumBoard extends Product {

    boardType: BoardType;
    edge: Edge;
    thickness: Thickness;
    width: Width;
    length: Length;
    name: string;    
    

    constructor(id: number, ptype: ProductTypes, tradeMark: TradeMark, boardType: BoardType, edge: Edge, thickness: Thickness, width: Width, length: Length) {
        super(id, ptype, tradeMark);
        this.boardType = boardType;
        this.edge = edge;
        this.thickness = thickness;
        this.width = width;
        this.length = length;   
        this.name = this.toString();
    }

    toString(): string {
        return `${this.tradeMark.name} тип ${this.boardType.name} ${this.edge.name}-${this.thickness.value}-${this.width.value}-${this.length.value}`;
    }
}
export default GypsumBoard;