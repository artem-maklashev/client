import React, { useEffect, useRef, useState } from "react";
import { Badge, Button, Col, Container, Modal, Row } from "react-bootstrap";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import dayjs from "dayjs";

import "react-datepicker/dist/react-datepicker.css";
import utc from 'dayjs/plugin/utc';
import DryMix from "../../../../model/mix/DryMix";
import Shift from "../../../../model/Shift";
import DateTimeSelector from "../../commonElements/dateTimeSelector";
import ShiftSelector from "../../commonElements/shiftSelector";
import MixSelector from "../../commonElements/mixSelector";
import MixCategoriesTable from "./mixCategoryTable";
import MixEditCategoryModal from "./mixEditCategoryModal";
import { Toast } from "primereact/toast";
import MixProduction from "../../../../model/mix/prodution/MixProduction";
import MixDelayTable from "./mixDelayTable";
import MixDelay from "../../../../model/mix/delays/MixDelay";

dayjs.extend(utc);

interface ProductionModalProps {
    show: boolean;
    handleClose: () => void;
    editProduction: MixCategoryProduction[];
    editProd: MixProduction | null;
    handleSave: (args: {
        productions: MixCategoryProduction[];
        newProduction: MixProduction;
        delays: MixDelay[];
    }) => void;
}

const ProductionModal: React.FC<ProductionModalProps> = ({ show, handleClose, editProduction, handleSave, editProd }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [productions, setProductions] = useState<MixCategoryProduction[]>([]);
    const [prod, setProd] = useState<MixProduction | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [mix, setMix] = useState<DryMix | null>(null);
    const [shift, setShift] = useState<Shift | null>(null);
    const [editCategoryModal, setEditCategoryModal] = useState<boolean>(false);
    const [categoryToEdit, setCategoryToEdit] = useState<MixCategoryProduction | null>(null);
    const [delays, setDelays] = useState<MixDelay[]>([]);

    const toast = useRef<Toast>(null);

    useEffect(() => {
        setProductions(editProduction);
    }, [editProduction]);

    useEffect(() => {
        if (editProd) {
            setProd(editProd);
            setStartDate(editProd.productionStart);
            setEndDate(editProd.productionFinish);
            setShift(editProd.shift);
            setMix(editProd.mix);
        }
    }, [editProd]);

    const clearState = () => {
        setProductions([]);
        setProd(null);
        setStartDate(null);
        setEndDate(null);
        setShift(null);
        setMix(null);
        setDelays([]);
    };

    const showError = () => {
        toast.current?.show({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не заполнены все поля',
            life: 3000,
        });
    };

    const showSuccess = () => {
        toast.current?.show({
            severity: 'success',
            summary: 'Успех',
            detail: 'Данные сохранены',
            life: 3000,
        });
    };

    const productionsSave = async () => {
        if (shift && mix && startDate && endDate) {
            const id = prod?.id || -1;
            const newProduction = new MixProduction(id, startDate, endDate, startDate, shift, mix);

            productions.forEach((p) => {
                p.production = newProduction;
            });

            try {
                setIsSaving(true); // Показываем спиннер
                await handleSave({ newProduction, productions, delays });
                showSuccess();
                clearState();
                handleClose();
            } catch (error) {
                console.error("Ошибка сохранения:", error);
                showError();
            } finally {
                setIsSaving(false); // Скрываем спиннер
            }
        } else {
            console.error('Не заполнены все поля:', { shift, mix, startDate, endDate });
            showError();
        }
    };

    const handleProductionDelays = (del: MixDelay[]) => {
        setDelays(del);
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Ввод данных</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <DateTimeSelector
                            date={startDate}
                            label={"Начальная дата"}
                            handleChange={setStartDate}
                        />
                        <DateTimeSelector
                            date={endDate}
                            label={"Конечная дата"}
                            handleChange={setEndDate}
                        />
                        <Col className="col-2">
                            <Badge pill bg="secondary">
                                Длительность: {dayjs(endDate).diff(dayjs(startDate), 'minutes')} минут
                            </Badge>
                        </Col>
                    </Row>
                    <Row>
                        <ShiftSelector shift={shift} handleShiftChange={setShift} />
                    </Row>
                    <Row>
                        <MixSelector mix={mix} handleMixChange={setMix} />
                    </Row>
                    <Row>
                        <MixCategoriesTable
                            categories={productions}
                            handleEditCategory={(category) => {
                                setCategoryToEdit(category);
                                setEditCategoryModal(true);
                            }}
                        />
                    </Row>
                    <Row className="mt-3">
                        <MixDelayTable
                            mixProduction={prod}
                            productionDelays={handleProductionDelays}
                        />
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Toast ref={toast} />
                {isSaving ? (
                    <Button variant="primary" disabled>
                        Сохранение...
                    </Button>
                ) : (
                    <Button variant="primary" onClick={productionsSave}>
                        Сохранить
                    </Button>
                )}
            </Modal.Footer>
            <MixEditCategoryModal
                show={editCategoryModal}
                handleSave={(newCategory) => {
                    setProductions((prev) => {
                        const exists = prev.find((p) => p.id === newCategory.id);
                        if (exists) {
                            return prev.map((p) => (p.id === newCategory.id ? newCategory : p));
                        }
                        return [...prev, newCategory];
                    });
                    setEditCategoryModal(false);
                    setCategoryToEdit(null);
                }}
                category={categoryToEdit}
                onHide={() => {
                    setEditCategoryModal(false);
                    setCategoryToEdit(null);
                }}
            />
        </Modal>
    );
};

export default ProductionModal;
