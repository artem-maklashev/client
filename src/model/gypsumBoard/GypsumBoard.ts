import Product from "../Product";
import TradeMark from "../TradeMark";
import ProductTypes from "../ProductTypes";
import BoardType from "./BoardType";
import Edge from "./Edge";
import Length from "./Length";
import Thickness from "./Thickness";
import Width from "./Width";

export class GypsumBoard extends Product {
    

    boardType: BoardType;
    edge: Edge;
    thickness: Thickness;
    width: Width;
    length: Length;
    productionSpeed: number;
    name: string;    

    constructor();
    constructor(
        id: number, ptype: ProductTypes, tradeMark: TradeMark, 
        boardType: BoardType, edge: Edge, thickness: Thickness, 
        width: Width, length: Length, productionSpeed: number
    );
    constructor(
        id?: number, ptype?: ProductTypes, tradeMark?: TradeMark, 
        boardType?: BoardType, edge?: Edge, thickness?: Thickness, 
        width?: Width, length?: Length, productionSpeed?: number
    ) {
        if (id !== undefined && ptype !== undefined && tradeMark !== undefined && boardType 
            !== undefined && edge !== undefined && thickness !== undefined && width !== undefined && length !== undefined
            && productionSpeed !== undefined
        ) {
            super(id, ptype, tradeMark);
            this.boardType = boardType;
            this.edge = edge;
            this.thickness = thickness;
            this.width = width;
            this.length = length;  
            this.productionSpeed = productionSpeed; 
        } else {
            // Значения по умолчанию
            super(0, new ProductTypes(), new TradeMark());
            this.boardType = new BoardType();
            this.edge = new Edge();
            this.thickness = new Thickness();
            this.width = new Width();
            this.length = new Length();
            this.productionSpeed = 0;
        }
        this.name = this.toString();
    }

    toString(): string {
        return `${this.tradeMark.name} тип ${this.boardType.name} ${this.edge.name}-${this.thickness.value}-${this.width.value}-${this.length.value}`;
    }
    static fromJSON(obj: any) {
         return new GypsumBoard(
      obj.id,
      ProductTypes.fromJSON(obj.ptype),
      TradeMark.fromJSON(obj.tradeMark),
      BoardType.fromJSON(obj.boardType),
      Edge.fromJSON(obj.edge),
      Thickness.fromJSON(obj.thickness),
      Width.fromJSON(obj.width),
      Length.fromJSON(obj.length),
      obj.productionSpeed
    );
  }
}
export default GypsumBoard;
