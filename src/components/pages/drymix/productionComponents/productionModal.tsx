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
dayjs.extend(utc);

interface ProductionModalProps {
    show: boolean;
    handleClose: () => void;
    editProduction: MixCategoryProduction[];
};

const ProductionModal: React.FC<ProductionModalProps> = ({ show, handleClose, editProduction }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [production, setProduction] = useState<MixCategoryProduction | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [mix, setMix] = useState<DryMix | null>(null);
    const [shift, setShift] = useState<Shift | null>(null);
    const [mixCategory, setMixCategory] = useState<MixCategory | null>(null);
    const [quantity, setQuantity] = useState<number>(0);




    useEffect(() => {
        if (production) {
            setProduction(production);

        }
        setOpen(show);
    }, [production, show]);


    const changeStartDate = (newValue: Date | null) => {
        setStartDate(newValue);
    };

    const changeEndDate = (newValue: Date | null) => {
        setEndDate(newValue);
    };


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
                        <MixCategoriesTable categories={[]} handleEditCategory={function (category: MixCategoryProduction): void {
                            throw new Error("Function not implemented.");
                        }} />
                    </Row>
                    <Row className="justify-content-center">
                        <Col className="col-2">
                            <Button variant='primary'>Сохранить</Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>

    )

}
export default ProductionModal;