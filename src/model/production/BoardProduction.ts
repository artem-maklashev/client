import ProductionList from "./ProductionList";
import GypsumBoard from "../gypsumBoard/GypsumBoard";
import GypsumBoardCategory from "../gypsumBoard/GypsumBoardCategory";
import Production from "./Production";


class BoardProduction extends Production<GypsumBoardCategory, GypsumBoard>{
    // id: number;
    // productionList: ProductionList;
    // gypsumBoard: GypsumBoard;
    // gypsumBoardCategory: GypsumBoardCategory;
    // value: number;


    constructor(id: number, pList: ProductionList, gypsumBoard: GypsumBoard, gypsumBoardCategory: GypsumBoardCategory, value: number) {
        super(gypsumBoardCategory, gypsumBoard,value, pList, id);
        // this.id = id;
        // this.productionList = pList;
        // this.gypsumBoard = gypsumBoard;
        // this.gypsumBoardCategory = gypsumBoardCategory;
        // this.value = value;
    }
}
export default BoardProduction;