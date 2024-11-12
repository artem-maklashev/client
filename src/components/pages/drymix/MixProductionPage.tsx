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
import { set } from "date-fns";
import MixProduction from "../../../model/mix/prodution/MixProduction";

interface MixProductionProps { }

const MixProductionPage: FC<MixProductionProps> = () => {
    const [categoryProductions, setCategoryProductions] = useState<MixCategoryProduction[]>([]);
    const [delays, setDelays] = useState<MixDelay[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editCategories, setEditCategories] = useState<MixCategoryProduction[] >([]);
    const [productions, setProductions] = useState<MixProduction[]>([]);
    const [editprod, setEditprod] = useState<MixProduction | null>(null);

    useEffect(() => {
        const fetchProductions = async () => {
            try {
                const response = await MixApiService.getLast10Productions();
                setCategoryProductions(response); 
                setProductions(getProductions(response));               
            } catch (error) {
                console.error("Error fetching productions:", error);
            }
        };

        if (categoryProductions.length === 0) {
            fetchProductions();
        }
    }, [categoryProductions.length]);

    const getProductions = (catProductions: MixCategoryProduction[]) => {
        const productions: MixProduction[] = [];
        catProductions.forEach(catProduction => {
            if (!productions.find(prod => prod.id === catProduction.production.id)) {
                productions.push(catProduction.production); 
            }
        });
        return productions;
    }

    useEffect(() => {
        setProductions(getProductions(categoryProductions));
    }, [categoryProductions])

    const handleAdd = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleEditProduction = (production: MixProduction) => {
        setEditCategories(categoryProductions.filter(prod => prod.production.id === production.id));
        setEditprod(production);
        setShowModal(true);
    }

    const saveProductions = async (prod: MixProduction, prods: MixCategoryProduction[]) => {
        // const responce = await MixApiService.saveMixProductions(productions);  
        // if (responce.status === 200) {
            // const responceData: MixCategoryProduction[] = responce.data;
            
        // responceData.forEach(production => {
            // prods.forEach(production => {

            // if (productions.find(prod => prod.id === production.id)) {
            //         const index = productions.findIndex(prod => prod.id === production.id);
            //         prods[index] = production;
            //     } else {
            //         prods.push(production);
            //     }
            // });
            setCategoryProductions(prevCategoryProductions => {
                const updatedProductions = prevCategoryProductions.map(prod =>
                    prods.find(newProd => newProd.id === prod.id) || prod
                );
                const newProductions = prods.filter(
                    newProd => !prevCategoryProductions.find(prod => prod.id === newProd.id)
                );
                return [...updatedProductions, ...newProductions];
            });
            
        // }
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col className="mt-2">
                    <MixProductionsTable productions={productions} onEdit={handleEditProduction} onDelete={function (rowData: MixProduction): void {
                        throw new Error("Function not implemented.");
                    } } />
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
            <ProductionModal show={showModal} handleClose={handleCloseModal} editProduction={editCategories} handleSave={({ newProduction, productions }) => saveProductions(newProduction, productions)} editProd={editprod}  />
        </Container>
    );
};

export default MixProductionPage;
