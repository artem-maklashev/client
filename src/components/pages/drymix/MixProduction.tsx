import { FC, useEffect, useState } from "react";
import MixDelay from "../../../model/mix/delays/MixDelay";
import { Container } from "react-bootstrap";
import MixApiService from "../../../service/MixApiService";
import React from "react";
import MixProductionsTable from "./productionComponents/productionsTable";

interface MixProductionProps {}

const MixProduction: FC<MixProductionProps> = () => {
    const [productions, setProductions] = useState<MixProduction[]>([]);
    const [delays, setDelays] = useState<MixDelay[]>([]);

    useEffect(() => {
        const fetchProductions = async () => {
            try {
                const response = await MixApiService.getLast10Productions();
                setProductions(response);
            } catch (error) {
                console.error("Error fetching productions:", error);
            }
        };

        if (productions.length === 0) {
            fetchProductions();
        }
    }, [productions.length]);

    return <Container>
        <MixProductionsTable productions={productions} />
    </Container>;
};

export default MixProduction;
