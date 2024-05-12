import React, { useEffect, useState } from "react";
import ProductionListTable from "./productionListTable";
import { ProductionLogData } from "./productionLogData";
import { Button, Col, Container, Row } from "react-bootstrap";
import ReportData from "../../../model/ReportData";
import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import BoardProduction from "../../../model/production/BoardProduction";
import Delays from "../../../model/delays/Delays";


const BoardProductionPage: React.FC = () => {
    // При использовании хука ProductionLogData, деструктурируем объект, который он возвращает
    const { productionList, } = ProductionLogData();
    const [reposts, setReports] = useState<ReportData<GypsumBoard, GypsumBoardCategory, BoardProduction, Delays>[]>(productionList);
    
    useEffect(() => {
        setReports(productionList);
    }, [productionList]);
    
    

    // Данные загружены успешно
    return (
        <Container className="mt-5 fluide">
            <Row>
                <Col className="col-12">
                    <ProductionListTable boardProductions={reposts} />

                </Col>
            </Row>
            <Row>
                <Button onClick={() =>{alert("Нажата кнопка создания отчета")}}>Добавить отчет</Button>
            </Row>
            
        </Container>
    );
}

export default BoardProductionPage;
