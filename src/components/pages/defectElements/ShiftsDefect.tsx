import BoardProduction from "../../../model/production/BoardProduction";
import React from "react";
import {Col, Row, Table} from "react-bootstrap";
import DefectsDataPrepare from "./DefectsDataPrepare";
import BoardDefectsLog from "../../../model/defects/BoardDefectsLog";

interface ShiftsDefectProps {
    defectsLog: BoardDefectsLog[];
    data: BoardProduction[];
}

class ProductionByShift {
    total: number;
    goodProduct: number;

    constructor(total: number, goodProduct: number) {
        this.total = total;
        this.goodProduct = goodProduct;
    }
}

const ShiftsDefect: React.FC<ShiftsDefectProps> = ({defectsLog, data}) => {
    if (data.length === 0 && defectsLog.length === 0) {
        return <div>Данных нет</div>;
    } else {
        console.log("Получены данные для процента по сменам в размере " + data.length);
    }
    const preparedDefects = new DefectsDataPrepare(defectsLog , data);
    const productionDictRaw: { [shift: string]: ProductionByShift } = preparedDefects.getProductionDict();
    const categorySummaryRaw: { [categoryName: string]: number } = preparedDefects.getCategorySummary();


    const productionDict = Object.entries(productionDictRaw).sort((a,b) => a[1].goodProduct/a[1].total - b[1].goodProduct/b[1].total );
    const categorySummary = Object.entries(categorySummaryRaw).sort((a, b) => b[1] - a[1]);
    const productionDictSummary = () => {
        let good = 0;
        let total = 0;
        productionDict.map(item =>{
           good += item[1].goodProduct;
           total += item[1].total;
        });
        return (1-good/total)*100;
    };
    const summaryPercent = productionDictSummary();


    const shiftTable = (
            <Col>
                <Row>
                    <Table striped bordered hover responsive variant="light">
                        <thead className="table-dark">
                        <tr className="text-center">
                            <th>Смена</th>
                            <th colSpan={2}>Процент брака</th>
                        </tr>
                        </thead>
                        <tbody>
                        {productionDict.map(([shift, productionData], index) => (
                            <tr className="text-center" key={shift}>
                                <td>{shift}</td>
                                <td>{((1 - productionData.goodProduct / productionData.total) * 100).toFixed(2)}%</td>
                            </tr>
                        ))}
                        </tbody>
                        <tbody className="table-dark">
                        <tr>
                            <td>Итого:</td>
                            <td colSpan={2} className="text-center">
                                <strong>{summaryPercent.toFixed(2)} %</strong>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </Row>
                <Row>
                    <Table striped bordered hover responsive variant="light">
                        <thead className="table-dark">
                        <tr className="text-center">
                            <th>Виды брака</th>
                            <th colSpan={2}>Количество</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categorySummary.map(([category, value], index) => (
                            <tr key={category}>
                                <td>{category}</td>
                                <td>{value.toFixed(2)} м²</td>
                            </tr>
                        ))}
                        </tbody>
                        <tbody className="table-dark">
                            <tr>
                                <td>Итого</td>
                                <td><strong>{(categorySummary.reduce((acc: number, [,value]) => acc + value, 0)
                            + defectsLog.reduce((acc, defectsLog) => acc=acc+defectsLog.value,0)
                            ).toFixed(2)} м²</strong></td>
                            </tr>
                        </tbody>
                    </Table>
                </Row>
            </Col>

        )
    ;
    return <div>{shiftTable}</div>;
}
export default ShiftsDefect;