import { Col, Container, Form, Row } from "react-bootstrap";
import ApiService from "../../service/ApiService";
import React, { useEffect, useState } from "react";
import DayRangeSelector from "./dashBoardComponent/dateRangeSelector";
import GypsumBoard from "../../model/gypsumBoard/GypsumBoard";
import Material from "../../model/specification/Material";
import ConsumptionChart from "./consumptionReportElements/consumptionChart";
import Thickness from "../../model/gypsumBoard/Thickness";
import SummaryConsumptionBarChart from "./consumptionReportElements/summaryConsumptionsBar";

interface ConsumptionReportProps { }

const now = new Date(ApiService.formatDateToISO(new Date()));

const ConsumptionReport: React.FC<ConsumptionReportProps> = () => {
  const [selectedRange, setSelectedRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: new Date(now.getFullYear(), now.getMonth(), 1),
    endDate: now,
  });
  const [gypsumBoardList, setGypsumBoardList] = useState<GypsumBoard[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<GypsumBoard | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<GypsumBoard[]>([]);
  const [thicknessList, setThicknessList] = useState<Thickness[]>([]);
  const [selectedThickness, setSelectedThickness] = useState<Thickness | null>(null);
  const [filteredGypsumBoardList, setFilteredGypsumBoardList] = useState<GypsumBoard[]>([]);


  // Загружаем гипсокартон только один раз
  useEffect(() => {
    const fetchGypsumBoards = async () => {
      const gbs: GypsumBoard[] = await ApiService.fetchGypsumBoards();

      setGypsumBoardList(gbs);
    };

    if (gypsumBoardList.length === 0) {
      fetchGypsumBoards();
    }
  }, [gypsumBoardList]); // Добавляем зависимость от длины массива, чтобы не зацикливаться

  // Загружаем материалы только один раз
  useEffect(() => {
    const fetchMaterials = async () => {
      const mtrls = await ApiService.fetchMaterials();
      setMaterials(mtrls);
    };

    if (materials.length === 0) {
      fetchMaterials();
    }
  }, [materials]); // Добавляем зависимость от длины массива материалов

  useEffect(() => {
    const fetchThickness = async () => {
      const thkns = await ApiService.fetchThicknesses();
      setThicknessList(thkns);
    }
    if (thicknessList.length === 0) {
      fetchThickness();
    }
  }, [thicknessList]);

  // Устанавливаем выбранный гипсокартон после загрузки данных
  useEffect(() => {
    if (!selectedProduct && gypsumBoardList.length > 0) {
      setSelectedProduct(gypsumBoardList[0]);
    }
  }, [gypsumBoardList, selectedProduct]);

  // Устанавливаем выбранный материал после загрузки данных
  useEffect(() => {
    if (!selectedMaterial && materials.length > 0) {
      setSelectedMaterial(materials[0]);
    }
  }, [materials, selectedMaterial]);

  useEffect(() => {
    if (selectedThickness) {
      const filteredGypsumBoards = gypsumBoardList.filter((g) => g.thickness.id === selectedThickness.id);
      setFilteredGypsumBoardList(filteredGypsumBoards);
      console.log("Устанавливаем новый список гипсокартона с толщиной", selectedThickness.value);
    } else {
      setFilteredGypsumBoardList(gypsumBoardList); // Если толщина не выбрана, показываем весь список
    }
  }, [selectedThickness, gypsumBoardList]); // Обновляем filteredGypsumBoardList при изменении толщины или исходного списка

  function handleDatesChange(startDate: Date | null, endDate: Date | null): void {
    setSelectedRange({ startDate, endDate });
  }

  return (
    <Container fluid className="mt-3 mb-5 bg-secondary">
      <Row lg={12} sm={12} md={12}>
        <Col lg={3} md={6} sm={6} className="mb-2">
          <Row>
            <DayRangeSelector onDatesChange={handleDatesChange} />
          </Row>
          <Row>
            <Form.Group>
              <Form.Label style={{ color: 'white' }}>Толщина</Form.Label>
              <Form.Select
                value={selectedThickness
                  ? selectedThickness.id.toString()
                  : ''
                }
                onChange={(e) => {
                  const selectedThicknessId = parseInt(e.target.value);
                  const thickness = thicknessList.find(
                    (tckns) => tckns.id === selectedThicknessId
                  );
                  setSelectedThickness(thickness || null);}}
              >
                {thicknessList.map((thic) => (
                  <option key={thic.id} value={thic.id.toString()}>
                    {thic.value}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group>
              <Form.Label style={{ color: "white" }}>Материал</Form.Label>
              <Form.Select
                value={
                  selectedMaterial
                    ? selectedMaterial.id.toString()
                    : materials.length > 0
                      ? materials[0].id.toString()
                      : ""
                }
                disabled={materials.length === 0}
                onChange={(e) => {
                  const selectedMaterialId = parseInt(e.target.value);
                  const material = materials.find(
                    (mtrl) => mtrl.id === selectedMaterialId
                  );
                  setSelectedMaterial(material || null);
                }}
              >
                {materials.map((material) => (
                  <option key={material.id} value={material.id.toString()}>
                    {material.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group>
              <Form.Label style={{ color: "white" }}>Гипсокартон</Form.Label>
              <Form.Select
                value={
                  selectedProducts.length > 0
                    ? selectedProducts.map((product) => product.id.toString())
                    : []
                }
                disabled={filteredGypsumBoardList.length === 0}
                multiple
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
                    parseInt(option.value)
                  );
                  const foundGypsumBoards = filteredGypsumBoardList.filter((gypsumBoard) =>
                    selectedOptions.includes(gypsumBoard.id)
                  );
                  setSelectedProducts(foundGypsumBoards); // Обновляем массив выбранных элементов
                }}
                style={{ height: '500px' }}
              >
                {filteredGypsumBoardList.map((gypsumBoard) => (
                  <option key={gypsumBoard.id} value={gypsumBoard.id.toString()}>
                    {ApiService.getName(gypsumBoard)}
                  </option>
                ))}

              </Form.Select>
            </Form.Group>


          </Row>
        </Col>
        <Col lg={9} md={6} sm={6} className="mb-2">
          <Row>
            <Col>
              <ConsumptionChart
                startDate={selectedRange.startDate ? selectedRange.startDate : now}
                endDate={selectedRange.endDate ? selectedRange.endDate : now}
                gypsumBoards={selectedProducts}
                material={selectedMaterial}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <SummaryConsumptionBarChart
                startDate={selectedRange.startDate ? selectedRange.startDate : now}
                endDate={selectedRange.endDate ? selectedRange.endDate : now}
                material={selectedMaterial}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ConsumptionReport;
