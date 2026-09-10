import { Accordion, Badge, Table } from "react-bootstrap";
import { FaIndustry, FaWrench, FaBriefcase } from "react-icons/fa";
import Delays from "../../../model/delays/Delays";
import { DelayPanelData } from "../../../model/DTO/gypsumboard/delays/DelayPanelData";

interface DelaysTreeViewProps {
    delays: DelayPanelData[];
}

export const DelaysTreeView: React.FC<DelaysTreeViewProps> = ({ delays }) => {
    const icons: Record<number, JSX.Element> = {
    1: <FaIndustry />,   // производство — фабрика
    2: <FaWrench />,     // ремонт — гаечный ключ
    3: <FaBriefcase />,  // коммерция — портфель
};

    if (!delays || delays.length === 0) {
        return <div className="text-muted fst-italic p-3">Нет данных для отображения</div>;
    }

    return (
        // flush убирает внешние границы, делая аккордеон легче визуально
        <Accordion defaultActiveKey="0" flush className="rounded-4 overflow-hidden border shadow-sm" >
            {delays.map((delay, index) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>
                        <div className="d-flex justify-content-between align-items-center w-100 me-3">
                            <span className="fw-semibold text-dark">
                                {delay.gypsumBoard.toString() || 'ГСП'}
                            </span>
                            <span className="fw-semibold text-dark">
                                смена: {delay.shift.name}
                            </span>
                            <Badge bg="light" text="secondary" pill className="border">
                                простоев: {delay.delaysList.length}
                            </Badge>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className="p-0">
                        <Table hover responsive className="mb-0 align-middle text-nowrap">
                            <thead className="text-muted" style={{ fontSize: '0.85rem' }}>
                                <tr>
                                    <th className="px-4 py-2 border-0">Время начала</th>
                                    <th className="py-2 border-0 text-end">Длительность</th>
                                    <th className="py-2 border-0">Тип простоя</th>
                                    <th className="py-2 border-0">Узел</th>
                                    <th className="px-4 py-2 border-0">Деталь</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '0.95rem' }}>
                                {delay.delaysList.map((d, idx) => {
                                    const diff = d.getDelta();                            

                                    // Задаем цвет фона прямо здесь
                                    const paperBg = { backgroundColor: '#fff9f4' };

                                    return (
                                        <tr key={idx}>
                                            {/* Добавляем style={paperBg} к каждому <td> */}
                                            <td style={paperBg}>
                                                {d.startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td style={paperBg} className="text-end">
                                                <Badge bg="light" text="secondary" pill className="border">
                                                    {d.delta.toFixed(2)}
                                                </Badge>                                        
                                            </td>
                                            <td style={paperBg} className="px-4 fw-medium text-dark">
                                                <span
                                                    className="me-1"
                                                    title={d.delayType.name}
                                                >
                                                    {icons[d.delayType.id]}
                                                </span>
                                            </td>
                                            <td style={paperBg}>
                                                {d.unitPart.unit.name}
                                            </td>
                                            <td style={paperBg}>
                                                {d.unitPart.name}
                                            </td>       
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>

            ))}
        </Accordion>
    );
};