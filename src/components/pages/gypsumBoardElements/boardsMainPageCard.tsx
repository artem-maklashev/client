import React, { useMemo, useState } from "react";
import { Col, Row, Spinner, Card, Table, Badge, Form, Button, Container } from "react-bootstrap";
import KpiCard from "./KpiCard";
import { useBoardProduction } from "./service/useBoardProduction";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { ConsumptionData } from "./consumptionData";

interface BoardCardProps { }

const formatDateForInput = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const BoardMainPageCard: React.FC<BoardCardProps> = () => {
    const now = new Date();

    // Даты вычисляем один раз, чтобы избежать зацикливания
    // const firstDay = useMemo(() => {
    //     const today = new Date();
    //     return new Date(today.getFullYear(), today.getMonth(), 1);
    // }, []);

    // const lastDay = useMemo(() => {
    //     const today = new Date();
    //     return new Date(today.getFullYear(), today.getMonth() + 1, 0);
    // }, []);

    const [dateRange, setDateRange] = useState({
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
    });

    // Передаем вычисленные даты в кастомный хук
    const {
        isLoading,
        planSum,
        factSum,
        deviation,
        defectPercentResult,
        todayPlan,
        lastThreeDays,
        productionDict,
    } = useBoardProduction(dateRange.start, dateRange.end);

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = e.target.value ? new Date(e.target.value) : dateRange.start;
        setDateRange(prev => ({ ...prev, start: newStart }));
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEnd = e.target.value ? new Date(e.target.value) : dateRange.end;
        setDateRange(prev => ({ ...prev, end: newEnd }));
    };

    const handleResetDates = () => {
        const today = new Date();
        setDateRange({
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: new Date(today.getFullYear(), today.getMonth() + 1, 0)
        });
    };

    return (
        <Container className="d-flex flex-column gap-3">
            <Row className='mt-3'>

            <Col sm={12} md={6} lg={3}>

                <Card
                    className="border-0 shadow-sm rounded-4 overflow-hidden"
                    style={{ backgroundColor: '#fffbf48f' }}
                >
                    <Card.Header
                        className="border-bottom-0  pb-2 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2 fw-semibold text-dark"
                        style={{ backgroundColor: '#6968688f' }}
                    >
                        {/* <div className='d-flex align-items-center gap-3'> */}
                            {/* <h5 className="mb-0 fw-bold text-dark"> */}
                                Производство ГСП
                                {/* </h5> */}
                            {/* <Badge bg="primary" pill className="px-3 py-2 fw-normal">
                                {now.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                            </Badge> */}
                        {/* </div> */}
                        <div className="d-flex align-items-center gap-2">
                            <Form.Control
                                type="date"
                                size="sm"
                                value={formatDateForInput(dateRange.start)}
                                onChange={handleStartDateChange}
                                className="bg-white border-0 shadow-sm rounded-3 text-muted"
                                style={{ minWidth: '130px' }}
                            />
                            <span className="text-muted fw-bold">-</span>
                            <Form.Control
                                type="date"
                                size="sm"
                                value={formatDateForInput(dateRange.end)}
                                onChange={handleEndDateChange}
                                className="bg-white border-0 shadow-sm rounded-3 text-muted"
                                style={{ minWidth: '130px' }}
                            />
                            <Button
                                variant="light"
                                size="sm"
                                onClick={handleResetDates}
                                className="shadow-sm rounded-3 text-secondary d-flex align-items-center justify-content-center"
                                style={{ width: '32px', height: '32px', padding: 0 }}
                                title="Сбросить на текущий месяц"
                            >
                                <BsArrowCounterclockwise size={16} />                    </Button>
                        </div>

                    </Card.Header>
                    <Card.Body className="p-3 p-md-4">

                        <Row className="g-3 mb-4">
                            <Col xs={6} lg={6}>
                                <KpiCard
                                    title="План на месяц"
                                    value={isLoading ? <Spinner animation="border" size="sm" /> : <>{planSum.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}&nbsp;м²</>}
                                />
                            </Col>
                            <Col xs={6} lg={6}>
                                <KpiCard
                                    title="Изготовлено"
                                    value={isLoading ? <Spinner animation="border" size="sm" /> : <>{factSum.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}&nbsp;м²</>}
                                />
                            </Col>
                        </Row>

                        <Row className="g-3 mb-4">
                            <Col xs={6} lg={6}>
                                <KpiCard
                                    title="Отклонение"
                                    value={
                                        isLoading ? <Spinner animation="border" size="sm" /> :
                                            <>
                                                <span style={{ fontSize: '0.8rem', display: 'block' }} className="fw-medium text-muted">
                                                    {deviation < 0 ? 'Отставание:' : 'Опережение:'}
                                                </span>
                                                {Math.abs(deviation).toLocaleString('ru-RU', { maximumFractionDigits: 0 })}&nbsp;м²
                                            </>
                                    }
                                    colorClass={deviation < 0 ? "text-danger" : "text-success"}
                                />
                            </Col>
                            <Col xs={6} lg={6}>
                                <KpiCard
                                    title="Процент брака"
                                    value={isLoading ? <Spinner animation="border" size="sm" /> : `${defectPercentResult.toFixed(2)} %`}
                                    colorClass={defectPercentResult > 3 ? "text-danger" : "text-success"}
                                />
                            </Col>
                        </Row>

                        <Card className="border border-light-subtle shadow-none rounded-4">
                            <Card.Header className="bg-transparent border-bottom pt-3 pb-3 px-4">
                                <h6 className="mb-0 fw-semibold text-secondary">План на сегодня</h6>
                            </Card.Header>
                            <Card.Body className="p-0">
                                {isLoading ? (
                                    <div className="d-flex justify-content-center align-items-center p-5">
                                        <Spinner animation="border" variant="primary" />
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <Table hover className="mb-0 align-middle">
                                            <thead className="table-light text-muted" style={{ fontSize: '0.85rem' }}>
                                                <tr>
                                                    <th className="text-start px-4 py-3 border-0 rounded-top-left-4">Наименование ГСП</th>
                                                    <th className="px-4 py-3 border-0 rounded-top-right-4 text-end">Кол-во (м²)</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ fontSize: '0.95rem' }}>
                                                {todayPlan.length > 0 ? (
                                                    todayPlan.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-4 py-3 border-bottom-0">
                                                                <div className="text-start fw-medium text-dark">
                                                                    {item.gypsumBoard.tradeMark.name}
                                                                </div>
                                                                <div className="text-start text-secondary" style={{ fontSize: '0.9em' }}>
                                                                    {item.gypsumBoard.boardType.name}-{item.gypsumBoard.edge.name} {item.gypsumBoard.thickness.value}-{item.gypsumBoard.width.value}-{item.gypsumBoard.length.value}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 border-bottom-0 text-end fw-semibold text-nowrap">
                                                                {item.planValue.toLocaleString('ru-RU')}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={2} className="text-center py-4 text-muted">
                                                            На сегодня производственных планов нет
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                    </Card.Body>
                </Card>
            </Col>
            <Col sm={12} md={6} lg={5}>
                <ConsumptionData startDate={dateRange.start} endDate={dateRange.end} lastThreeDays={lastThreeDays} productionDict={productionDict} />
            </Col>
            </Row>
        </Container>
    );
};

export default BoardMainPageCard;