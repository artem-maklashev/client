import React, { useEffect, useState } from "react";
import ProductionListTable from "./productionListTable";
import { ProductionLogData } from "./productionLogData";
import { Container } from "react-bootstrap";


const BoardProductionPage: React.FC = () => {
    // При использовании хука ProductionLogData, деструктурируем объект, который он возвращает
    const { productionList, } = ProductionLogData();


    

    // Данные загружены успешно
    return (
        <Container className="mt-5 fluide">
            <ProductionListTable boardProductions={productionList} />
        </Container>
    );
}

export default BoardProductionPage;
