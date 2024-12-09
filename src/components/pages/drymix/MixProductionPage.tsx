import { FC, useEffect, useRef, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

import MixApiService from "../../../service/MixApiService";
import MixProductionsTable from "./productionComponents/productionsTable";
import ProductionModal from "./productionComponents/productionModal";

import MixProduction from "../../../model/mix/prodution/MixProduction";
import MixCategoryProduction from "../../../model/mix/prodution/MixCategoryProduction";
import MixDelay from "../../../model/mix/delays/MixDelay";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import React from "react";

interface MixProductionProps {}

const MixProductionPage: FC<MixProductionProps> = () => {
    const [categoryProductions, setCategoryProductions] = useState<MixCategoryProduction[]>([]);
    const [productions, setProductions] = useState<MixProduction[]>([]);
    const [editprod, setEditprod] = useState<MixProduction | null>(null);
    const [editCategories, setEditCategories] = useState<MixCategoryProduction[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // Добавлено состояние для загрузки


    const toast = useRef<Toast>(null);

    useEffect(() => {
        fetchProductions();
    }, []);

    // Fetch последние 10 выпусков
    const fetchProductions = async () => {
        setLoading(true); // Начало загрузки
        try {
            const response = await MixApiService.getLast10Productions();
            const categories = await getCategories(response);
            setProductions(response);
            setCategoryProductions(categories);
        } catch (error) {
            console.error("Error fetching productions:", error);
            showError("Не удалось загрузить данные.");
        } finally {
            setLoading(false); // Завершение загрузки
        }
    };

    // Получить категории по выпускам
    const getCategories = async (productions: MixProduction[]): Promise<MixCategoryProduction[]> => {
        try {
            return await MixApiService.getCategoriesByProductions(productions);
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    };

    // Добавление/редактирование выпуска
    const saveProductions = async (prod: MixProduction, prods: MixCategoryProduction[], delays: MixDelay[]) => {
        try {
            const savedProduction = await MixApiService.saveMixProduction(prod);
            if (!savedProduction?.id) throw new Error("Failed to save main production.");

            const productionsToSave = prepareProductions(prods, savedProduction);
            const delaysToSave = prepareDelays(delays, savedProduction);

            const [, savedProductions] = await Promise.all([
                MixApiService.saveMixDelays(delaysToSave, savedProduction.id),
                MixApiService.saveMixProductions(productionsToSave),
            ]);

            const updatedCategories = await getCategories(savedProductions);
            setCategoryProductions(updatedCategories);

            showSuccess("Удачно сохранено!");
        } catch (error) {
            console.error("Error saving production:", error);
            showError("Ошибка сохранения данных.");
        } finally {
            setEditprod(null);
            setShowModal(false);
        }
    };

    // Удаление выпуска
    const handleDeleteProduction = async (production: MixProduction) => {
        try {
            const response = await MixApiService.deleteMixProduction(production.id);
            if (response) {
                setProductions((prev) => prev.filter((p) => p.id !== production.id));
                setCategoryProductions((prev) =>
                    prev.filter((p) => p.production.id !== production.id)
                );
                showSuccess("Удачно удалено!");
            }
        } catch (error) {
            console.error("Error deleting production:", error);
            showError("Ошибка удаления.");
        }
    };

    // Вспомогательные функции
    const prepareDelays = (delays: MixDelay[], production: MixProduction) =>
        delays.map((delay) => ({ ...delay, mixProduction: production }));

    const prepareProductions = (prods: MixCategoryProduction[], production: MixProduction) =>
        prods.map((prod) => ({ ...prod, production }));

    // Уведомления
    const showSuccess = (message: string) => {
        toast.current?.show({ severity: "success", summary: "Успех", detail: message, life: 3000 });
    };

    const showError = (message: string) => {
        toast.current?.show({ severity: "error", summary: "Ошибка", detail: message, life: 3000 });
    };

    return (
        <Container className="mt-5">
            <Toast ref={toast} />
            {loading ? ( // Показываем спиннер, если идет загрузка
                <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
                    <Row>
                        <Col className="mt-3">
                            <h4 className="text-center mt-3">
                                <span className="badge bg-secondary">Последние 10 выпусков сухих смесей</span>
                            </h4>
                            <MixProductionsTable
                                productions={productions}
                                onEdit={(prod) => {
                                    setEditCategories(
                                        categoryProductions.filter((p) => p.production.id === prod.id)
                                    );
                                    setEditprod(prod);
                                    setShowModal(true);
                                }}
                                onDelete={handleDeleteProduction}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex justify-content-center my-2">
                            <Button
                                icon="pi pi-plus"
                                label="Добавить"
                                severity="secondary"
                                onClick={() => {
                                    setEditprod(null);
                                    setEditCategories([]);
                                    setShowModal(true);
                                }}
                                style={{ borderRadius: "10px" }}
                                size="small"
                            />
                        </Col>
                    </Row>
                    <ProductionModal
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        editProduction={editCategories}
                        handleSave={({ newProduction, productions, delays }) =>
                            saveProductions(newProduction, productions, delays)
                        }
                        editProd={editprod}
                    />
                </>
            )}
        </Container>
    );
};

export default MixProductionPage;
