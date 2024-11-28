import React, { useEffect, useRef, useState } from "react";
import { Badge, Button, Col, Container, Modal, Row } from "react-bootstrap";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import dayjs from "dayjs";
import { Stack } from "@mui/material";

import "react-datepicker/dist/react-datepicker.css";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import utc from 'dayjs/plugin/utc';
import DryMix from "../../../../model/mix/DryMix";
import Shift from "../../../../model/Shift";
import MixCategory from "../../../../model/mix/prodution/MixCategory";
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
    const [open, setOpen] = useState<boolean>(false);
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

    // Синхронизируем `productions` с `editProduction` только при его изменении
    useEffect(() => {
        setProductions(editProduction);
    }, [editProduction]);

    useEffect(() => {
        if (editProd) {
            setProd(editProd);
            setStartDate(editProd.productionStart || null);
            setEndDate(editProd.productionFinish || null);
            setShift(editProd.shift);
            setMix(editProd.mix);
        }
    }, [editProd]);

    useEffect(() => {
        setOpen(show);
    }, [show]);




    const changeStartDate = (newValue: Date | null) => {
        setStartDate(newValue);
    };

    const changeEndDate = (newValue: Date | null) => {
        setEndDate(newValue);
    };

    const handleEditCategory = (category: MixCategoryProduction) => {
        setCategoryToEdit(category);
        setEditCategoryModal(true);
    };

    const handleSaveCategory = (newCategory: MixCategoryProduction) => {
        setProductions(prevProductions => {
            const exists = prevProductions.find(p => p.id === newCategory.id);
            if (exists) {
                return prevProductions.map(p => p.id === newCategory.id ? newCategory : p);
            } else {
                return [...prevProductions, newCategory];
            }
        });
        closeCategoryModal();
    };

    const closeCategoryModal = () => {
        setEditCategoryModal(false);
        setCategoryToEdit(null);
    };

    const showError = () => {
        if (toast.current) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Не заполнены все поля',
                life: 3000
            });
        }
    };

    const showSuccess = () => {
        if (toast.current) {
            toast.current.show({
                severity: 'success',
                summary: 'Success!',
                detail: 'Удачно сохранено',
                life: 3000
            });
        }
    };

    const productionsSave = () => {
        if (shift && mix && startDate && endDate) {
            const id = prod?.id || -1;
            const newProduction = new MixProduction(id, startDate, endDate, startDate, shift, mix);
            productions.forEach(p => {
                p.production = newProduction;
            });
            handleSave({ newProduction, productions, delays });
            showSuccess();
            handleClose();
        } else {
            console.log('Не заполнены все поля', shift, mix, startDate, endDate);
            showError();
        }
    }

    const handleProductionDelays = (delays: MixDelay[]) => {
        setDelays(delays);
    }

    return (
        <Modal show={open} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Ввод данных</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <DateTimeSelector date={startDate} label={"Начальная дата"} handleChange={changeStartDate} />
                        <DateTimeSelector date={endDate} label={"Конечная дата"} handleChange={changeEndDate} />
                        <Col className="col-2">
                            <Badge pill bg='secondary'>
                                Длительность: {dayjs(endDate).diff(dayjs(startDate), 'minutes')} минут
                            </Badge>
                        </Col>
                    </Row>
                    <Row>
                        <ShiftSelector shift={shift} handleShiftChange={(shift: Shift) => setShift(shift)} />
                    </Row>
                    <Row>
                        <MixSelector mix={mix} handleMixChange={(mix: DryMix) => setMix(mix)} />
                    </Row>
                    <Row>
                        <MixCategoriesTable categories={productions} handleEditCategory={handleEditCategory} />
                    </Row>
                    <Row className="mt-3">
                        <MixDelayTable mixProduction={prod} productionDelays={handleProductionDelays}/>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Row className="">
                    <Col className="col-2">
                        <Toast ref={toast} />
                        <Button variant='primary' onClick={productionsSave}>Сохранить</Button>
                    </Col>
                </Row>
            </Modal.Footer>
            <MixEditCategoryModal show={editCategoryModal} handleSave={handleSaveCategory} category={categoryToEdit} onHide={closeCategoryModal} />
        </Modal>
    );
};

export default ProductionModal;
