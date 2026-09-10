import Delays from "../../../delays/Delays";
import GypsumBoard from "../../../gypsumBoard/GypsumBoard";
import Shift from "../../../Shift";

export class DelayPanelData {
    gypsumBoard: GypsumBoard;
    shift: Shift;
    delaysList: Delays[];
    constructor(
        gypsumBoard: GypsumBoard, shift: Shift,delaysList: Delays[]) {
            this.gypsumBoard = gypsumBoard;
            this.shift = shift;
            this.delaysList = delaysList;
        }

    static fromJSON(json: any): DelayPanelData {
        return new DelayPanelData(
            GypsumBoard.fromJSON(json.gypsumBoard),
            Shift.fromJSON(json.shift),
            json.delaysList.map((delaysList: any) => 
                Delays.fromJSON(delaysList))
        );
    }
}