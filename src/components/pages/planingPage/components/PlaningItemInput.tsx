import { useEffect, useMemo, useState } from "react";
import ApiService from "../../../../service/ApiService";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import { Button, Form, InputGroup } from "react-bootstrap";
import { DrywallItem } from "../models/DrywallItem";
import BoardType from "../../../../model/gypsumBoard/BoardType";
import Width from "../../../../model/gypsumBoard/Width";
import { EmptyBoard } from "../../../../model/gypsumBoard/EmptyBoard";

interface PlaningItemInputProps {
    onAdd: (item: DrywallItem) => void;
    month: Date;
}

/**
 * Компонент для ввода данных о планируемом производстве гипсокартона
 * Позволяет пользователю выбрать тип гипсокартона и указать количество,
 * после чего создается элемент планирования с расчетом времени начала и окончания производства
 *
 * @param onAdd - функция обратного вызова для добавления нового элемента планирования
 */
const PlaningItemInput: React.FC<PlaningItemInputProps> = ({ onAdd, month }) => {
    /**
     * Создаем пустой гипсокартон для не рабочего времени с помощью useMemo для оптимизации
     * Этот элемент добавляется в начало списка для возможности выбора "не рабочего времени"
     */
    const emptyBoard: GypsumBoard = useMemo(() => {
        // const board = new GypsumBoard();
        // const emptyType = new BoardType(0, "нерабочее время");
        // board.boardType = emptyType;
        // board.factSpeed = 1 / 1.2; // Скорость производства по умолчанию
        // const emptyWidth = new Width(0, "1200");
        // board.width = emptyWidth;
        // board.id = 0;
        const board = new EmptyBoard();
        return board;
    }, []);

    // Список доступных гипсокартонов
    const [gypsumBoardList, setGypsumboardList] = useState<GypsumBoard[]>([]);
    // ID выбранного гипсокартона
    const [selectedBoardId, setSelectedBoardId] = useState<number | "">("");
    // Количество (в квадратных метрах)
    const [quantity, setQuantity] = useState<number | "">("");

    /**
     * Загрузка списка гипсокартонов при монтировании компонента
     */
    useEffect(() => {
        const initializeService = async () => {
            try {
                const gypsumBoards = await ApiService.fetchGypsumBoards();
                // Добавляем пустой гипсокартон в начало списка
                const combined = [emptyBoard, ...gypsumBoards];
                setGypsumboardList(combined);
            } catch (error) {
                console.error("Ошибка загрузки гипсокартона:", error);
            }
        };
        initializeService();
    }, []);

    /**
     * Обработчик изменения выбора гипсокартона
     * @param e - событие изменения выбора
     */
    const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBoardId(Number(e.target.value));
    };

    /**
     * Обработчик изменения количества
     * @param e - событие изменения ввода
     */
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Разрешаем ввод только чисел и десятичных разделителей (точка и запятая)
        if (value === "" || /^\d+[.,]?\d*$/.test(value)) {
            setQuantity(value === "" ? "" : Number(value.replace(",", ".")));
        }
    };

    /**
     * Создание нового элемента планирования
     * @param board - выбранный гипсокартон
     * @param parsedQuantity - количество (в квадратных метрах)
     * @returns новый элемент DrywallItem
     */
    const createDrywallItem = (board: GypsumBoard, parsedQuantity: number): DrywallItem => {
        // const month = new Date(); // Текущая дата
        const startProduction = new Date(month);
        startProduction.setHours(8, 0, 0, 0); // Устанавливаем время начала на 8:00

        // Вычисляем время окончания производства
        const endProduction = new Date(startProduction.getTime() + (parsedQuantity / board.factSpeed) * 60 * 1000);

        return new DrywallItem(
            board.id === 0 ? 0 : -1, 
            board,
            parsedQuantity,
            new Date(new Date(month.getFullYear(), month.getMonth(), 1).toISOString()),
            startProduction,
            endProduction
        );
    };

    /**
     * Обработчик добавления нового элемента
     */
    const handleAdd = () => {
        // Проверяем, что выбран гипсокартон
        const board = gypsumBoardList.find((b) => b.id === selectedBoardId);
        if (!board) {
            console.warn("Гипсокартон не выбран");
            alert("Пожалуйста, выберите тип гипсокартона");
            return;
        }

        // Проверяем, что введено корректное количество
        const parsedQuantity = typeof quantity === "string" ? parseFloat(quantity.replace(",", ".")) : quantity;
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            console.warn("Некорректное количество:", quantity);
            alert("Пожалуйста, введите корректное количество (положительное число)");
            return;
        }

        // Проверяем, что скорость производства корректна
        if (isNaN(board.factSpeed) || board.factSpeed <= 0) {
            console.warn("Некорректная скорость производства:", board.factSpeed);
            alert("Выбранный гипсокартон имеет некорректную скорость производства");
            return;
        }

        try {
            // Создаем новый элемент и добавляем его
            const item = createDrywallItem(board, parsedQuantity);
            onAdd(item);

            // Сброс формы
            setSelectedBoardId("");
            setQuantity("");
        } catch (error) {
            console.error("Ошибка при создании элемента планирования:", error);
            alert("Произошла ошибка при добавлении элемента. Пожалуйста, попробуйте еще раз.");
        }
    };


    return (
        <Form className="d-flex align-items-center flex-wrap gap-3 mb-3">
            {/* Селектор типа гипсокартона */}
            <div className="d-flex align-items-center gap-2">
                <Form.Label htmlFor="gypsumBoardSelect" className="mb-0" style={{ whiteSpace: "nowrap" }}>
                    Гипсокартон
                </Form.Label>
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
            </div>

            {/* Поле ввода площади в квадратных метрах */}
            <InputGroup style={{ maxWidth: "200px" }}>
                <InputGroup.Text>м²</InputGroup.Text>
                <Form.Control
                    type="text" // Используем text вместо number для лучшей поддержки запятой
                    aria-label="Площадь в квадратных метрах"
                    value={quantity}
                    onChange={handleQuantityChange}
                    placeholder="Введите площадь"
                />
            </InputGroup>

            {/* Кнопка добавления элемента */}
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
