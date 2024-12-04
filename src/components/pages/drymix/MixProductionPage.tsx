import { FC, useEffect, useRef, useState } from "react";
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
import { Toast } from "primereact/toast";

interface MixProductionProps { }

const MixProductionPage: FC<MixProductionProps> = () => {
    const [categoryProductions, setCategoryProductions] = useState<MixCategoryProduction[]>([]);
    const [delays, setDelays] = useState<MixDelay[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editCategories, setEditCategories] = useState<MixCategoryProduction[]>([]);
    const [productions, setProductions] = useState<MixProduction[]>([]);
    const [editprod, setEditprod] = useState<MixProduction | null>(null);

    const toast = useRef<Toast>(null);

    const showSuccessSave = () => {
        if (toast.current) {
            toast.current.show({
                severity: 'success',
                summary: 'Success!',
                detail: 'Удачно сохранено',
                life: 3000
            });
        }
    };

    const showSuccessDelete = () => {
        if (toast.current) {
            toast.current.show({
                severity: 'success',
                summary: 'Success!',
                detail: 'Удачно удалено',
                life: 3000
            });
        }
    };

    const showError = () => {
        if (toast.current) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Операция не выполнена',
                life: 3000
            });
        }
    };

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
    }, [categoryProductions, delays]);

    const handleAdd = () => {
        setEditprod(null);
        setEditCategories([]);
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

    const saveProductions = async (prod: MixProduction, prods: MixCategoryProduction[], delays: MixDelay[]) => {
        try {
            const savedProduction = await MixApiService.saveMixProduction(prod);
            if (savedProduction.id > 0) {
                const productionsToSave = prods.map(p => ({ ...p, production: savedProduction }));
                const delaysToSave = delays.map(d => ({ ...d, mixProduction: savedProduction }));
    
                const [updatedDelays, savedProductions] = await Promise.all([
                    MixApiService.saveMixDelays(delaysToSave, savedProduction.id),
                    MixApiService.saveMixProductions(productionsToSave)
                ]);
    
                setDelays(updatedDelays);
                setCategoryProductions(prev => [...prev, ...savedProductions]);
                showSuccessSave();
            }
        } catch (error) {
            console.error("Error saving production:", error);
            showError();
        } finally {
            setEditprod(null);
        }
    };
    

    const handleDeleteProduction = async (production: MixProduction) => {
        try {
            const responce = await MixApiService.deleteMixProduction(production.id);
            if (responce) {
                setCategoryProductions(prevCategoryProductions => prevCategoryProductions.filter(prod => prod.production.id !== production.id));
                setProductions(prevProductions => prevProductions.filter(prod => prod.id !== production.id));
                showSuccessDelete();
            }
        } catch (error) {
            console.error("Error deleting production:", error);
            showError();
        }
    }

    return (
        <Container className="mt-5">
            <Toast ref={toast} />
            <Row>
                <Col className="mt-3">
                    <h4 className="text-center mt-3">
                        <span className="badge bg-secondary">Последние 10 выпусков сухих смесей</span>
                    </h4>
                    <MixProductionsTable productions={productions} onEdit={handleEditProduction} onDelete={handleDeleteProduction} />
                </Col>
            </Row>
            <Row className="d-flex">
                <Col className="justify-content-center d-flex my-2">
                    <Button
                        icon="pi pi-plus"
                        // className="p-button-rounded p-button-secondary p-button-sm"
                        label="Добавить"
                        severity='secondary'
                        onClick={() => handleAdd()}
                        style={{ borderRadius: '10px' }}
                        size="small"
                    />
                </Col>
            </Row>
            <ProductionModal
                show={showModal}
                handleClose={handleCloseModal}
                editProduction={editCategories}
                handleSave={({ newProduction, productions, delays }) => saveProductions(newProduction, productions, delays)}
                editProd={editprod} />
        </Container>
    );
};

export default MixProductionPage;
