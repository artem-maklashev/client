import GypsumBoard from "../gypsumBoard/GypsumBoard";
import Material from "./material";

class Specification {
    id: number;
    product: GypsumBoard;
    material: Material;
    quantity: number;

    constructor (id: number, product: GypsumBoard, material: Material, quantity: number) {
        this.id = id;
        this.material = material;
        this.product = product;
        this.quantity = quantity; 
    }
}
export default Specification;