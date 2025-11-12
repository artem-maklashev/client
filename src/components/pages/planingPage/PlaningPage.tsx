import { Col, Container, Row } from "react-bootstrap";
import PeriodSelector from "../planElements/periodselector";
import { useState } from "react";
import { DrywallGanttChart } from "./components/DrywallGanttChart";
import { DrywallItem } from "./models/DrywallItem";
import { DrywallTable } from "./components/DrywallTable";

interface PlaningPageProps {
}
const PlaningPage: React.FC<PlaningPageProps> = () => {
    const now = new Date()
    const [period, setPeriod] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));
    const [activeTab, setActiveTab] = useState<"table" | "gantt">("table");
    const [drywallItems, setDrywallItems] = useState<DrywallItem[]>([]);

    function onPeriodChange(period: Date): void {
        setPeriod(period);
    }

    const handleItemsChange = (items: DrywallItem[]) => {
        setDrywallItems(items);
    };

    return (
  <Container fluid className="mt-5">
    <Row className="mt-5">
      <Col lg={12} sm={12} className="mt-4">
        <PeriodSelector onPeriodChange={onPeriodChange} period={period} />

        {/* Вкладки для переключения между таблицей и диаграммой Ганта */}
        <div className="d-flex mb-3">
          <button 
            className={`btn ${activeTab === "table" ? "btn-primary" : "btn-outline-primary"} me-2`}
            onClick={() => setActiveTab("table")}
          >
            Таблица
          </button>
          <button 
            className={`btn ${activeTab === "gantt" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("gantt")}
          >
            Диаграмма Ганта
          </button>
        </div>

        {activeTab === "table" ? (
          <DrywallTable month={period} onItemsChange={handleItemsChange} />
        ) : (
          <DrywallGanttChart items={drywallItems} />
        )}
      </Col>
    </Row>
  </Container>
);

}
export default PlaningPage;