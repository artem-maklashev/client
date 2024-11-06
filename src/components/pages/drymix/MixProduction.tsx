import { FC, useEffect, useState } from "react";
import MixDelay from "../../../model/mix/delays/MixDelay";
import { Col, Container, Row } from "react-bootstrap";
import MixApiService from "../../../service/MixApiService";
import React from "react";
import MixProductionsTable from "./productionComponents/productionsTable";
import MixCategoryProduction from "../../../model/mix/prodution/MixCategoryProduction";
import { Button } from "primereact/button";
import Product from "../../../model/Product";
import ProductionModal from "./productionComponents/productionModal";

interface MixProductionProps {}

const MixProduction: FC<MixProductionProps> = () => {
    const [productions, setProductions] = useState<MixCategoryProduction[]>([]);
    const [delays, setDelays] = useState<MixDelay[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editProduction, setEditProduction] = useState<MixCategoryProduction | null>(null);

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

    const handleAdd = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    return <Container className="mt-5">
        <Row>
            <Col className="mt-2">
                <MixProductionsTable productions={productions} />
            </Col>
        </Row>
        <Row>
            <Button
                icon="pi pi-plus"
                className="p-button-rounded p-button-secoundary p-button-sm"
                onClick={() => handleAdd()}
                size="small"
                label="Добавить"
            />            
        </Row>
        <ProductionModal show={showModal} handleClose={handleCloseModal} editProduction={null} />
    </Container>
};

export default MixProduction;
