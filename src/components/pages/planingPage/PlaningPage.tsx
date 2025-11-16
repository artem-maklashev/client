import { Col, Container, Row } from "react-bootstrap";
import PeriodSelector from "../planElements/periodselector";
import { useEffect, useState } from "react";
import { DrywallItem } from "./models/DrywallItem";
import { DrywallTable } from "./components/DrywallTable";
import { ProductionTable } from "./components/ProductionTable";
import { SlideSidebar } from "../../../service/library/slidepanel/SlideSidebar";
import { DrywallService } from "./services/DrywallService";

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
    }

     useEffect(() => {
        let isCancelled = false;
    
        
    
        const initializeService = async () => {
          try {
            // Очищаем текущие элементы перед загрузкой новых
            setDrywallItems([]);
            
    
            const service = new DrywallService(period);
            
            if (isCancelled) return;
    
            const loadedItems = await service.loadItems();
            if (isCancelled) return;
    
            // Устанавливаем загруженные элементы в сервис без пересчета периодов
            service.setItems(loadedItems);
    
            // Устанавливаем загруженные элементы напрямую без добавления в сервис
            // Это предотвращает ненужный пересчет периодов для загруженных данных
            if (!isCancelled) {
              setDrywallItems(loadedItems);    
             
            }
          } catch (error) {
            if (!isCancelled) {
              console.error("Ошибка загрузки гипсокартона:", error);
            }
          }
        };
    
        initializeService();
    
        return () => {
          isCancelled = true;
        };
      }, [period]);

    return (
  <Container fluid className="mt-5 mb-5">
    <Row className="mt-5" >
      <Col lg={2} sm={12} className="mt-4">
        <SlideSidebar header="Календарь производства" label="Ввод данных" children={
          <DrywallTable month={period} onItemsChange={handleItemsChange} loadedItems={drywallItems}/>
        } />
        <PeriodSelector onPeriodChange={onPeriodChange} period={period} />
          {/* <DrywallGanttChart items={drywallItems} /> */}
      </Col>
      <Col lg={10} sm={12} className="mt-4">
          <ProductionTable planingItems={drywallItems} />
       </Col>
    </Row>
  </Container>
);

}
export default PlaningPage;