import ProductionList from "./ProductionList";
import GypsumBoard from "../gypsumBoard/GypsumBoard";
import GypsumBoardCategory from "../gypsumBoard/GypsumBoardCategory";
import Production from "./Production";

export default class BoardProduction extends Production<GypsumBoardCategory, GypsumBoard> {
  constructor(
    id: number,
    pList: ProductionList,
    gypsumBoard: GypsumBoard,
    gypsumBoardCategory: GypsumBoardCategory,
    value: number
  ) {
    super(gypsumBoardCategory, gypsumBoard, value, pList, id);
  }

  static fromJSON(obj: any): BoardProduction {
    // 1. Десериализуем вложенные объекты
    const gypsumBoard = GypsumBoard.fromJSON(obj.gypsumBoard);
    
    // 2. Десериализуем категорию (если GypsumBoardCategory — класс с fromJSON)
    const gypsumBoardCategory = GypsumBoardCategory.fromJSON(obj.gypsumBoardCategory);
    
    // 3. Десериализуем ProductionList (обязательно!)
    const productionList = ProductionList.fromJSON(obj.productionList);

    // 4. Передаём в правильном порядке
    return new BoardProduction(
      obj.id,
      productionList,            // ← 2-й аргумент: ProductionList
      gypsumBoard,               // ← 3-й: GypsumBoard
      gypsumBoardCategory,       // ← 4-й: GypsumBoardCategory
      obj.value                  // ← 5-й: number
    );
  }
}

