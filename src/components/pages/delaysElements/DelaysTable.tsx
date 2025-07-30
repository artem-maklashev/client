import React, { useState } from "react";
import Delays from "../../../model/delays/Delays";
import DelayDataPrepare from "./DalayDataPrepare";
import { Button, Col, Row, Card, Table } from "react-bootstrap";
import { FaPrint, FaDownload } from "react-icons/fa";
import * as XLSX from 'xlsx';
import prepareExportData from "./export/exportData";


interface DelaysTableProps {
    data: Delays[];
    planDuration: number;
}

const DelaysTable: React.FC<DelaysTableProps> = ({ data, planDuration }) => {
    const [isPrinting, setIsPrinting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    if (data.length === 0) {
        return (
            <Card className="shadow-sm border-0">
                <Card.Body className="text-center py-5">
                    <div className="text-muted">
                        <i className="bi bi-info-circle me-2"></i>
                        Данных по простоям нет
                    </div>
                </Card.Body>
            </Card>
        );
    }

    const minDate = new Date(Math.min(...data.map(delay => new Date(delay.delayDate).getTime())));
    const maxDate = new Date(Math.max(...data.map(delay => new Date(delay.delayDate).getTime())));

    const filteredData = data.filter(
        (item) => item.unitPart.unit.productionArea.division.id === 1
    );

    const preparedData = new DelayDataPrepare(filteredData).getSummary();
    const delaysSummary = preparedData.delaysSummary;
    const unitData = preparedData.unitData;

    const formatPercentage = (value: number, total: number): string => {
        if (total === 0) return '0.00';
        return ((value * 100) / total).toFixed(2);
    };

    const tables = Object.entries(unitData).map(
        ([delayType, tableData], tableIndex) => (
            <Card key={`card-${tableIndex}`} className="mb-4 shadow-sm border-0">
  <Card.Header className="bg-primary text-white">
    <h5 className="mb-0 text-center">{delayType}</h5>
  </Card.Header>
  <Card.Body className="p-0">
    <div className="table-responsive"> {/* Используем table-responsive для прокрутки */}
      <Table
        bordered
        hover
        className="mb-0"
        style={{
          tableLayout: 'auto', // Ширина по содержимому
        }}
        // Убираем style у таблицы, который ограничивает ширину
        // width, minWidth будут определяться содержимым и table-responsive
      >
        <thead className="table-light">
          <tr>
            {/* Для колонок с коротким содержимым используем w-1 (1% ширины) */}
            <th className="text-center align-middle w-1">Участок</th>
            <th className="text-center align-middle w-1">Узел</th>
            {/* Для основной колонки с переменной длиной используем w-auto или не указываем класс ширины */}
            <th className="text-center align-middle">Деталь</th>
            <th className="text-center align-middle w-1">Длительность (мин)</th>
            <th className="text-center align-middle w-1">%</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <tr key={`${delayType}-${index}`}>
              <td className="align-middle text-nowrap">{item.unitPart.unit.productionArea.name}</td>
              <td className="align-middle text-nowrap">{item.unitPart.unit.name}</td>
              {/* Для длинного содержимого добавляем стили напрямую или через классы */}
              <td
                className="align-middle"
                style={{
                  maxWidth: '300px', // Ограничиваем ширину
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap', // Запрещаем перенос для точек многоточия
                }}
                title={item.unitPart.name} // Показываем полный текст при наведении
              >
                {item.unitPart.name}
              </td>
              <td className="text-center align-middle fw-medium text-nowrap">{item.delta}</td>
              <td className="text-center align-middle text-nowrap">
                <span className="badge bg-info-subtle text-info-emphasis">
                  {formatPercentage(item.delta, planDuration)}%
                </span>
              </td>
            </tr>
          ))}
          <tr className="table-success fw-bold">
            <td colSpan={3} className="text-end align-middle">Итого:</td>
            <td className="text-center align-middle text-nowrap">{delaysSummary[delayType]}</td>
            <td className="text-center align-middle text-nowrap">
              <span className="badge bg-success-subtle text-success-emphasis">
                {formatPercentage(delaysSummary[delayType], planDuration)}%
              </span>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  </Card.Body>
</Card>
        )
    );

    const handlePrint = () => {
        const printContent = document.querySelector('.delays-table-container');

        if (!printContent) return;

        setIsPrinting(true);

        const printWindow = window.open('', '_blank');

        if (!printWindow) {
            alert('Пожалуйста, разрешите всплывающие окна для этого сайта');
            setIsPrinting(false);
            return;
        }

        const printStyles = `
        <style>
            @page {
                size: landscape;
                margin: 5mm;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 5px;
                margin: 0;
            }
            .print-header {
                text-align: center;
                margin-bottom: 20px;
            }
            .print-header h4 {
                margin: 0 0 10px 0;
                color: #212529;
            }
            .print-header p {
                margin: 0;
                color: #6c757d;
            }
            .card {
                border: 1px solid #dee2e6;
                margin-bottom: 15px;
                page-break-inside: avoid;
            }
            .card-header {
                background-color: #f8f9fa;
                color: #212529;
                border-bottom: 1px solid #dee2e6;
                padding: 10px 15px;
            }
            .card-header h5 {
                margin: 0;
                text-align: center;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 0;
                font-size: 12px;
            }
            th, td {
                border: 1px solid #dee2e6;
                padding: 6px 8px;
                line-height: 1.3;
            }
            th {
                background-color: #f8f9fa;
                font-weight: 600;
                text-align: center;
            }
            .text-center {
                text-align: center;
            }
            .text-end {
                text-align: right;
            }
            .fw-bold {
                font-weight: bold;
            }
            .table-success {
                background-color: #d1e7dd;
            }
            .badge {
                display: inline-block;
                padding: 0.35em 0.65em;
                font-size: 0.75em;
                font-weight: 700;
                line-height: 1;
                color: #495057;
                text-align: center;
                white-space: nowrap;
                vertical-align: baseline;
                border-radius: 0.375rem;
                background-color: #e9ecef;
            }
        </style>
    `;

        const printHTML = `
        <div class="print-header">
            <h4>Отчет по простоям</h4>
            <p>Период: ${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}</p>
        </div>
        ${printContent.innerHTML}
    `;

        // Создаем структуру документа
        const doc = printWindow.document;
        doc.open();

        // Создаем элементы через DOM API
        const html = doc.createElement('html');
        const head = doc.createElement('head');
        const body = doc.createElement('body');

        // Добавляем title
        const title = doc.createElement('title');
        title.textContent = 'Отчет по простоям';
        head.appendChild(title);

        // Добавляем стили
        const style = doc.createElement('style');
        style.textContent = printStyles.replace(/<\/?style>/g, '');
        head.appendChild(style);

        // Добавляем контент
        body.innerHTML = printHTML;

        // Добавляем скрипт печати
        const script = doc.createElement('script');
        script.text = `
        window.onload = function() {
            setTimeout(function() {
                window.print();
                window.close();
            }, 500);
        };
    `;
        body.appendChild(script);

        // Собираем документ
        html.appendChild(head);
        html.appendChild(body);
        doc.appendChild(html);

        doc.close();

        // Обработчик на случай, если окно было закрыто вручную
        printWindow.addEventListener('beforeunload', () => {
            setIsPrinting(false);
        });

        // Альтернативный способ убедиться, что состояние сбрасывается
        setTimeout(() => {
            if (!printWindow.closed) {
                printWindow.close();
            }
            setIsPrinting(false);
        }, 3000);
    };

    const handleExport = () => {
        setIsExporting(true); // Опционально: показать состояние загрузки

        try {
            // 1. Подготавливаем данные
            const exportData = prepareExportData(unitData, delaysSummary, planDuration, formatPercentage);

            // 2. Создаем рабочую книгу (workbook)
            const wb = XLSX.utils.book_new();
            wb.Props = {
                Title: "Отчет по простоям",
                Subject: "Данные о простоях",
                Author: "Ваше приложение",
                CreatedDate: new Date()
            };

            // 3. Создаем лист (worksheet) из данных
            const ws = XLSX.utils.json_to_sheet(exportData, { skipHeader: false });

            // 4. (Опционально) Настройка ширины колонок
            const colWidths = [
                { wch: 20 }, // Участок
                { wch: 20 }, // Узел
                { wch: 30 }, // Деталь
                { wch: 20 }, // Длительность
                { wch: 10 }  // %
            ];
            ws['!cols'] = colWidths;

            // 5. Добавляем лист в книгу
            XLSX.utils.book_append_sheet(wb, ws, "Простои");

            // 6. Генерируем имя файла
            const fileName = `Отчет_по_простоям_${minDate.toLocaleDateString().replace(/\./g, '-')}_${maxDate.toLocaleDateString().replace(/\./g, '-')}.xlsx`;

            // 7. Экспортируем файл
            XLSX.writeFile(wb, fileName);

            // Или альтернативно, если хотите использовать file-saver:
            // const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            // const blob = new Blob([wbout], { type: 'application/octet-stream' });
            // saveAs(blob, fileName);

        } catch (error) {
            console.error("Ошибка при экспорте:", error);
            alert("Произошла ошибка при экспорте данных. Пожалуйста, попробуйте еще раз.");
        } finally {
            setIsExporting(false); // Опционально: скрыть состояние загрузки
        }
    };

    return (
        <div className="delays-table-container">
            {/* Заголовок с кнопками управления */}
            <Row className="align-items-center mb-4">
                <Col xs={12} md={6}>
                    <h4 className="mb-0">
                        <i className="bi bi-clock-history me-2"></i>
                        Отчет по простоям
                    </h4>
                    <div className="text-muted small">
                        Период: {minDate.toLocaleDateString()} - {maxDate.toLocaleDateString()}
                    </div>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-end gap-2 mt-3 mt-md-0">
                    <Button
                        variant="outline-primary"
                        onClick={handleExport}
                        className="no-print d-flex align-items-center"
                        disabled={isPrinting || isExporting} // Добавлено isExporting
                    >
                        {isExporting ? ( // Добавлено отображение состояния загрузки
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Экспорт...
                            </>
                        ) : (
                            <>
                                <FaDownload className="me-2" />
                                Экспорт
                            </>
                        )}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handlePrint}
                        className="no-print d-flex align-items-center"
                        disabled={isPrinting}
                    >
                        <FaPrint className="me-2" />
                        Печать
                    </Button>
                </Col>
            </Row>

            {/* Сводная информация */}
            <Card className="mb-4 shadow-sm border-0 no-print">
                <Card.Body>
                    <Row>
                        <Col md={3} className="mb-3 mb-md-0">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                    <i className="bi bi-list-task text-primary fs-4"></i>
                                </div>
                                <div>
                                    <div className="text-muted small">Всего записей</div>
                                    <div className="h5 mb-0">{data.length}</div>
                                </div>
                            </div>
                        </Col>
                        <Col md={3} className="mb-3 mb-md-0">
                            <div className="d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                                    <i className="bi bi-calendar-range text-success fs-4"></i>
                                </div>
                                <div>
                                    <div className="text-muted small">Период</div>
                                    <div className="h5 mb-0">
                                        {Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} дней
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="d-flex align-items-center">
                                <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3">
                                    <i className="bi bi-stopwatch text-info fs-4"></i>
                                </div>
                                <div>
                                    <div className="text-muted small">Общее время простоев</div>
                                    <div className="h5 mb-0">
                                        {Object.values(delaysSummary).reduce((a, b) => a + b, 0)} мин
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                                    <i className="bi bi-info-circle fs-4"></i>
                                </div>
                                <div>
                                    <div className="text-muted small">Плановое время работы</div>
                                    <div className="h5 mb-0">
                                        {planDuration} мин / {planDuration / 720} смен
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Таблицы с данными - только это будет печататься */}
            <div className="print-content">
                {tables}
            </div>

            {/* Информация о плане */}
            {planDuration > 0 && (
                <Card className="mt-4 shadow-sm border-0 no-print">
                    <Card.Body className="text-center">
                        <div className="text-muted">
                            Общее плановое время: <strong>{planDuration} минут</strong> |
                            Процент простоев: <strong>
                                {formatPercentage(
                                    Object.values(delaysSummary).reduce((a, b) => a + b, 0),
                                    planDuration
                                )}%
                            </strong>
                        </div>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default DelaysTable;