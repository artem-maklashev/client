import { useEffect, useMemo, useState } from "react";
import ApiService from "../../../../service/ApiService";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { DrywallItem } from "../models/DrywallItem";
import { EmptyBoard } from "../../../../model/gypsumBoard/EmptyBoard";

interface PlaningItemInputProps {
    onAdd: (item: DrywallItem) => void;
    month: Date;
}

const PlaningItemInput: React.FC<PlaningItemInputProps> = ({ onAdd, month }) => {
    const emptyBoard: GypsumBoard = useMemo(() => new EmptyBoard(), []);

    const [gypsumBoardList, setGypsumboardList] = useState<GypsumBoard[]>([]);
    const [selectedBoardId, setSelectedBoardId] = useState<number | "">("");
    const [quantity, setQuantity] = useState<number | "">("");
    const [loading, setLoading] = useState<boolean>(true); // состояние загрузки

    useEffect(() => {
        const initializeService = async () => {
            try {
                setLoading(true);
                const gypsumBoards = await ApiService.fetchGypsumBoards();
                const combined = [emptyBoard, ...gypsumBoards];
                setGypsumboardList(combined);
            } catch (error) {
                console.error("Ошибка загрузки гипсокартона:", error);
            } finally {
                setLoading(false);
            }
        };
        initializeService();
    }, [emptyBoard]);

    const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBoardId(Number(e.target.value));
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || /^\d+[.,]?\d*$/.test(value)) {
            setQuantity(value === "" ? "" : Number(value.replace(",", ".")));
        }
    };

    const createDrywallItem = (board: GypsumBoard, parsedQuantity: number): DrywallItem => {
        const startProduction = new Date(month);
        startProduction.setHours(8, 0, 0, 0);

        const endProduction = new Date(startProduction.getTime() + (parsedQuantity / board.factSpeed) * 60 * 1000);

        return new DrywallItem(
            board.id === 0 ? 0 : -1,
            board,
            parsedQuantity,
            new Date(month.getFullYear(), month.getMonth(), 1),
            startProduction,
            endProduction
        );
    };

    const handleAdd = () => {
        const board = gypsumBoardList.find((b) => b.id === selectedBoardId);
        if (!board) {
            alert("Пожалуйста, выберите тип гипсокартона");
            return;
        }

        const parsedQuantity = typeof quantity === "string" ? parseFloat(quantity.replace(",", ".")) : quantity;
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            alert("Введите корректное количество");
            return;
        }

        if (isNaN(board.factSpeed) || board.factSpeed <= 0) {
            alert("Некорректная скорость производства");
            return;
        }

        try {
            const item = createDrywallItem(board, parsedQuantity);
            onAdd(item);
            setSelectedBoardId("");
            setQuantity("");
        } catch (error) {
            console.error("Ошибка при создании элемента планирования:", error);
            alert("Произошла ошибка при добавлении элемента.");
        }
    };

    return (
        <Form className="d-flex align-items-center flex-wrap gap-3 mb-3">
            {/* Селектор типа гипсокартона */}
            <div className="d-flex align-items-center gap-2">
                <Form.Label htmlFor="gypsumBoardSelect" className="mb-0" style={{ whiteSpace: "nowrap" }}>
                    Гипсокартон
                </Form.Label>

                {loading ? (
                    <Spinner animation="border" size="sm" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </Spinner>
                ) : (
                    <Form.Select
                        id="gypsumBoardSelect"
                        value={selectedBoardId}
                        onChange={handleBoardChange}
                        className="scrollable-select"
                        style={{ minWidth: "200px" }}
                        aria-label="Выберите тип гипсокартона"
                    >
                        <option value="">-- выберите --</option>
                        {gypsumBoardList.map((board) => (
                            <option key={board.id} value={board.id}>
                                {board.toString()}
                            </option>
                        ))}
                    </Form.Select>
                )}
            </div>

            {/* Поле ввода площади */}
            <InputGroup style={{ maxWidth: "200px" }}>
                <InputGroup.Text>м²</InputGroup.Text>
                <Form.Control
                    type="text"
                    aria-label="Площадь в квадратных метрах"
                    value={quantity}
                    onChange={handleQuantityChange}
                    placeholder="Введите площадь"
                />
            </InputGroup>

            {/* Кнопка добавления */}
            <Button
                variant="primary"
                onClick={handleAdd}
                disabled={selectedBoardId === "" || quantity === ""}
                aria-label="Добавить элемент планирования"
            >
                Добавить
            </Button>
        </Form>
    );
};

export default PlaningItemInput;
