import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Stack } from "@mui/material";


import "react-datepicker/dist/react-datepicker.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/ru";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import utc from 'dayjs/plugin/utc';
import ApiService from "../../../../service/ApiService";
import DryMix from "../../../../model/mix/DryMix";
import Shift from "../../../../model/Shift";
import MixCategory from "../../../../model/mix/prodution/MixCategory";
import DateTimeSelector from "../../commonElements/dateTimeSelector";
import { ShiftList } from "../../boardProductionInput/productComponents/FetchShiftList";
import ShiftSelector from "../../commonElements/shiftSelector";
import MixSelector from "../../commonElements/mixSelector";
import MixCategoriesTable from "./mixCategoryTable";
import MixEditCategoryModal from "./mixEditCategoryModal";
import MixProduction from "../../../../model/mix/prodution/MixProduction";
dayjs.extend(utc);

interface ProductionModalProps {
    show: boolean;
    handleClose: () => void;
    editProduction: MixCategoryProduction[];
};

const ProductionModal: React.FC<ProductionModalProps> = ({ show, handleClose, editProduction }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [production, setProduction] = useState<MixCategoryProduction[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [mix, setMix] = useState<DryMix | null>(null);
    const [shift, setShift] = useState<Shift | null>(null);
    const [mixCategory, setMixCategory] = useState<MixCategory | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
    
    const [categoryToEdit, setCategoryToEdit] = useState<MixCategoryProduction | null>(null);
    const [editCategoryModal, setEditCategoryModalModal] = useState<boolean>(false);




    useEffect(() => {
        if (editProduction.length > 0) {
            setProduction(editProduction);

        }
        setOpen(show);
    }, [production, show]);

    useEffect(() => {
        if (production.length > 0) {
            const prod = production[0];
            setShift(prod.production.shift);
            setMix(prod.production.mix);
        }
    }, []);


    const changeStartDate = (newValue: Date | null) => {
        setStartDate(newValue);
    };

    const changeEndDate = (newValue: Date | null) => {
        setEndDate(newValue);
    };

    const handleEditCategory = (category: MixCategoryProduction) => {
        setCategoryToEdit(category);
        setEditCategoryModalModal(true);
    }

    const handleSaveCategory = (newCategory: MixCategoryProduction) => {
        const exists = production.find(p => p.id === newCategory.id);
        if (exists) {
            const index = production.findIndex(p => p.id === newCategory.id);
            production[index] = newCategory;
            setProduction([...production]);
        } else {   
            production.push(newCategory);
        }
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
                        <ShiftSelector handleShiftChange={(shift: Shift) => setShift(shift)} />
                    </Row>
                    <Row>
                        <MixSelector handleMixChange={(mix: DryMix) => setMix(mix)} />
                    </Row>
                    <Row>
                        <MixCategoriesTable categories={[]} handleEditCategory={(category) =>handleEditCategory(category)} />
                    </Row>
                    <Row className="justify-content-center">
                        <Col className="col-2">
                            <Button variant='primary'>Сохранить</Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <MixEditCategoryModal show={editCategoryModal} handleSave={(newCategory: MixCategoryProduction) => handleSaveCategory} category={categoryToEdit} />
        </Modal>

    )

}
export default ProductionModal;