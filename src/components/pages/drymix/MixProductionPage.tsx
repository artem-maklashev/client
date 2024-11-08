import { FC, useEffect, useState } from "react";
import MixDelay from "../../../model/mix/delays/MixDelay";
import { Col, Container, Row } from "react-bootstrap";
import MixApiService from "../../../service/MixApiService";
import React from "react";
import MixProductionsTable from "./productionComponents/productionsTable";
import MixCategoryProduction from "../../../model/mix/prodution/MixCategoryProduction";
import { Button } from "primereact/button";
import ProductionModal from "./productionComponents/productionModal";
import "primereact/resources/themes/lara-light-indigo/theme.css";

interface MixProductionProps { }

const MixProductionPage: FC<MixProductionProps> = () => {
    const [productions, setProductions] = useState<MixCategoryProduction[]>([]);
    const [delays, setDelays] = useState<MixDelay[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editProduction, setEditProduction] = useState<MixCategoryProduction[] >([]);

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

    return (
        <Container className="mt-5">
            <Row>
                <Col className="mt-2">
                    <MixProductionsTable productions={productions} />
                </Col>
            </Row>
            <Row className="d-flex">
                <Col className="justify-content-center d-flex">
                    <Button
                        icon="pi pi-plus"
                        // className="p-button-rounded p-button-secondary p-button-sm"
                        label="Добавить"
                        severity='secondary'
                        onClick={() => handleAdd()}
                        style={{borderRadius: '10px'}}
                        size="small"
                    />
                </Col>
            </Row>
            <ProductionModal show={showModal} handleClose={handleCloseModal} editProduction={editProduction} />
        </Container>
    );
};

export default MixProductionPage;
