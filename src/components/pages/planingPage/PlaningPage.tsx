import { Col, Container, Row } from "react-bootstrap";
import PeriodSelector from "../planElements/periodselector";
import { useState } from "react";
import { DrywallGanttChart } from "./components/DrywallGanttChart";
import { DrywallItem } from "./models/DrywallItem";
import { DrywallTable } from "./components/DrywallTable";
import { ProductionTable } from "./components/ProductionTable";
import { SlideSidebar } from "../../../service/library/slidepanel/SlideSidebar";

interface PlaningPageProps {
}
const PlaningPage: React.FC<PlaningPageProps> = () => {
    const now = new Date()
    const [period, setPeriod] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));
    const [drywallItems, setDrywallItems] = useState<DrywallItem[]>([]);

    function onPeriodChange(period: Date): void {
        setPeriod(period);
    }

    const handleItemsChange = (items: DrywallItem[]) => {
        setDrywallItems(items);
    };

    return (
  <Container fluid className="mt-5 mb-2">
    <Row className="mt-5" >
      <Col lg={2} sm={12} className="mt-4">
        <PeriodSelector onPeriodChange={onPeriodChange} period={period} />
        <SlideSidebar header="Календарь производства" label="Календарь" children={
          <DrywallTable month={period} onItemsChange={handleItemsChange} />
        } />
          {/* <DrywallGanttChart items={drywallItems} /> */}
      </Col>
      <Col lg={10} sm={12} className="mt-4">
          <ProductionTable items={drywallItems} />
       </Col>
    </Row>
  </Container>
);

}
export default PlaningPage;