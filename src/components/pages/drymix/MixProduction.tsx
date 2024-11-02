import { FC, useEffect, useState } from "react";
import MixCategoryProduction from "../../../model/mix/prodution/MixCategoryProduction";
import MixDelay from "../../../model/mix/delays/MixDelay";
import { Col, Container } from "react-bootstrap";
import React from "react";
import DayRangeSelector from "../dashBoardComponent/dateRangeSelector";

interface MixProductionProps { }

const MixProduction: FC<MixProductionProps> = () => {   

    const [productions, setProductions] = useState<MixCategoryProduction[]>([]);
    const [delays, setDelays] = useState<MixDelay[]>([]);

    useEffect(() => {
        if (productions.length === 0) {
            getProductions();
        }       
       
    }, []);






    return (
        <Container>
            
        </Container>
    );
}
export default MixProduction;