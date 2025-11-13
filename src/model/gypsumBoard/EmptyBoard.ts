import Product from "../Product";
import TradeMark from "../TradeMark";
import ProductTypes from "../ProductTypes";
import BoardType from "./BoardType";
import Edge from "./Edge";
import Length from "./Length";
import Thickness from "./Thickness";
import Width from "./Width";
import GypsumBoard from "./GypsumBoard";

export class EmptyBoard extends GypsumBoard {
    

    boardType: BoardType;    
    width: Width;   
    name: string; 
    factSpeed: number;   

    constructor();
    constructor(
        id: number, ptype: ProductTypes, tradeMark: TradeMark, 
        boardType: BoardType, edge: Edge, thickness: Thickness, 
        width: Width, length: Length, productionSpeed: number, factSpeed: number
    );
    constructor(
        id?: number, ptype?: ProductTypes, tradeMark?: TradeMark, 
        boardType?: BoardType, edge?: Edge, thickness?: Thickness, 
        width?: Width, length?: Length, productionSpeed?: number, factSpeed?: number
    ) {
            (super())
            // Значения по умолчанию
            this.boardType = new BoardType(0, "нерабочее время");
            this.edge = new Edge();
            this.thickness = new Thickness();
            this.width = new Width(0, "1200");
            this.length = new Length();
            this.productionSpeed = 0;
            this.factSpeed = 1 / 1.2; // Скорость производства по умолчанию0;
        
        this.name = this.toString();
    }

    toString(): string {        
            return `${this.boardType.name}`;        
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
      obj.productionSpeed,
      obj.factSpeed
    );
  }
}
export default GypsumBoard;
