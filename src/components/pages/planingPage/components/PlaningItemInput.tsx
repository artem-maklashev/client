import { useEffect, useState } from "react";
import ApiService from "../../../../service/ApiService";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import { Button, Form, InputGroup } from "react-bootstrap";
import { DrywallItem } from "../models/DrywallItem";

interface PlaningInputItemProps {
    onAdd: (item: DrywallItem) => void;
}

const PlaningInputItem: React.FC<PlaningInputItemProps> = ({ onAdd }) => {
    const [gypsumBoardList, setGypsumboardList] = useState<GypsumBoard[]>([]);
    const [selectedBoardId, setSelectedBoardId] = useState<number | "">("");
    const [quantity, setQuantity] = useState<number | "">("");


    useEffect(() => {
        const initializeService = async () => {
            try {
                const gypsumBoards = await ApiService.fetchGypsumBoards();
                setGypsumboardList(gypsumBoards);
            } catch (error) {
                console.error("Ошибка загрузки гипсокартона:", error);
            }
        };
        initializeService();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBoardId(Number(e.target.value));
    };

    const handleAdd = () => {
        const board = gypsumBoardList.find((b) => b.id === selectedBoardId);
        const parsedQuantity = typeof quantity === "string" ? parseFloat(quantity.replace(",", ".")) : quantity;

        if (!board || !parsedQuantity || parsedQuantity <= 0) return;

        const month = new Date(); // или фиксированная дата, например: new Date(2025, 10, 1)
        const startProduction = new Date(month);
        startProduction.setHours(8, 0, 0, 0);

        const endProduction = new Date(startProduction.getTime() + (parsedQuantity / board.factSpeed) * 60 * 1000);

        const item = new DrywallItem(
            Date.now(), // или UUID
            board,
            parsedQuantity,
            month,
            startProduction,
            endProduction
        );

        onAdd(item);

        // Сброс формы
        setSelectedBoardId("");
        setQuantity("");
    };


    return (
        <Form className="d-flex align-items-center flex-wrap gap-3">
            {/* Метка + селектор */}
            <div className="d-flex align-items-center gap-2">
                <Form.Label htmlFor="gypsumBoardSelect" className="mb-0" style={{ whiteSpace: "nowrap" }}>
                    Гипсокартон
                </Form.Label>
                <Form.Select
                    id="gypsumBoardSelect"
                    value={selectedBoardId}
                    onChange={handleChange}
                    className="scrollable-select"
                    style={{ minWidth: "200px" }}
                >
                    <option value="">-- выберите --</option>
                    {gypsumBoardList.map((board) => (
                        <option key={board.id} value={board.id}>
                            {board.toString()}
                        </option>
                    ))}
                </Form.Select>
            </div>

            {/* Поле ввода площади */}
            <InputGroup style={{ maxWidth: "200px" }}>
                <InputGroup.Text>м²</InputGroup.Text>
                <Form.Control
                    type="number"
                    aria-label="value"
                    value={quantity}
                    onChange={(e) => {
                        const value = e.target.value;
                        setQuantity(value === "" ? "" : Number(value));
                    }}
                />
            </InputGroup>

            {/* Кнопка */}
            <Button variant="primary" onClick={handleAdd}>Добавить</Button>
        </Form>


    );
};

export default PlaningInputItem;
