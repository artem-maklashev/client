import React, { useEffect, useState } from "react";
import ProductionListTable from "./productionListTable";
import { ProductionLogData } from "./productionLogData";
import { Container } from "react-bootstrap";
import ReportData from "../../../model/ReportData";
import GypsumBoardCategory from "../../../model/gypsumBoard/GypsumBoardCategory";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";


const BoardProductionPage: React.FC = () => {
    // При использовании хука ProductionLogData, деструктурируем объект, который он возвращает
    const { productionList, } = ProductionLogData();
    const [reposts, setReports] = useState<ReportData<GypsumBoard, GypsumBoardCategory>[]>(productionList);
    
    useEffect(() => {
        setReports(productionList);
    }, [productionList]);
    
    

    // Данные загружены успешно
    return (
        <Container className="mt-5 fluide">
            <ProductionListTable boardProductions={reposts} />
        </Container>
    );
}

export default BoardProductionPage;
