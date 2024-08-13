import GypsumBoard from "./GypsumBoard";

class Plan {
    id: number;
    planDate: Date;
    gypsumBoard: GypsumBoard;
    planValue: number;

    constructor(id: number, plan_date: Date, gypsumBoard: GypsumBoard, value: number) {
        this.id = id;
        this.planDate = plan_date;
        this.gypsumBoard = gypsumBoard;
        this.planValue = value;
    }



}
export default Plan;