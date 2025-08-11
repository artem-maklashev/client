import React, { useState } from "react";
import { Button, Col, Row, Card } from "react-bootstrap";
import { FaPrint, FaDownload } from "react-icons/fa";
import Delays from "../../../model/delays/Delays";
import DelayDataPrepare from "./DalayDataPrepare";
import DelayUnitTable from "./DelayUnitTable";
import useDelaysExportAndPrint from "./useDelaysExportAndPrint";
import { formatPercentage, getMinMaxDates, daysBetween } from "./utils";

interface DelaysTableProps {
    data: Delays[];
    planDuration: number;
}

const DelaysTable: React.FC<DelaysTableProps> = ({ data, planDuration }) => {
    const [isPrinting, setIsPrinting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Всегда безопасно готовим данные для хука
    const delayDates = data.length > 0
        ? data.map(d => ({ delayDate: new Date(d.delayDate).toISOString() }))
        : [{ delayDate: new Date().toISOString() }];

    const { minDate, maxDate } = getMinMaxDates(delayDates);

    const filtered = data.length > 0
        ? data.filter(d => d.unitPart.unit.productionArea.division.id === 1)
        : [];

    const { delaysSummary, unitData } = data.length > 0
        ? new DelayDataPrepare(filtered).getSummary()
        : { delaysSummary: {}, unitData: {} };

    // Хук всегда вызывается с валидными значениями
    const { handlePrint, handleExport } = useDelaysExportAndPrint({
        unitData,
        delaysSummary,
        planDuration,
        minDate,
        maxDate,
        formatPercentage,
        setIsExporting,
        setIsPrinting
    });

    // Рендер при отсутствии данных
    if (data.length === 0) {
        return (
            <Card className="shadow-sm border-0">
                <Card.Body className="text-center py-5 text-muted">
                    <i className="bi bi-info-circle me-2"></i>Данных по простоям нет
                </Card.Body>
            </Card>
        );
    }

    // Рендер при наличии данных
    return (
        <div className="delays-table-container">
            {/* Header with buttons */}
            <Row className="align-items-center mb-4">
                <Col md={6}>
                    <h4 className="mb-0">
                        <i className="bi bi-clock-history me-2"></i>Отчет по простоям
                    </h4>
                    <div className="text-muted small">
                        Период: {minDate.toLocaleDateString()} – {maxDate.toLocaleDateString()}
                    </div>
                </Col>
                <Col md={6} className="d-flex justify-content-end gap-2">
                    <Button variant="outline-primary" onClick={handleExport} disabled={isPrinting || isExporting}>
                        {isExporting ? (
                            <> <span className="spinner-border spinner-border-sm me-2"></span>Экспорт...</>
                        ) : (
                            <> <FaDownload className="me-2" />Экспорт</>
                        )}
                    </Button>
                    <Button variant="primary" onClick={handlePrint} disabled={isPrinting}>
                        <FaPrint className="me-2" />Печать
                    </Button>
                </Col>
            </Row>

            {/* Summary Card */}
            <Card className="mb-4 shadow-sm border-0 no-print">
                <Card.Body>
                    <Row>
                        <Col md={3}>
                            <div className="text-muted small">Всего записей</div>
                            <div className="h5">{data.length}</div>
                        </Col>
                        <Col md={3}>
                            <div className="text-muted small">Период</div>
                            <div className="h5">{daysBetween(minDate, maxDate)} дней</div>
                        </Col>
                        <Col md={3}>
                            <div className="text-muted small">Общее время простоев</div>
                            <div className="h5">{Object.values(delaysSummary).reduce((a, b) => a + b, 0)} мин</div>
                        </Col>
                        <Col md={3}>
                            <div className="text-muted small">Плановое время работы</div>
                            <div className="h5">{planDuration} мин / {planDuration / 720} смен</div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Tables */}
            <div className="print-content">
                {Object.entries(unitData).map(([delayType, tableData], i) => (
                    <DelayUnitTable
                        key={i}
                        delayType={delayType}
                        tableData={tableData}
                        delaySummary={delaysSummary[delayType]}
                        planDuration={planDuration}
                        formatPercentage={formatPercentage}
                    />
                ))}
            </div>
        </div>
    );
};

export default DelaysTable;
