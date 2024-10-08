import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import { GypsumBoardList } from "../boardProductionInput/productComponents/FetchGypsumBoard";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";
import { Row } from "primereact/row";
import { InputText } from "primereact/inputtext";
import Plan from "../../../model/gypsumBoard/Plan";
import { Button } from "primereact/button";

addLocale('ru', {
    firstDayOfWeek: 1,
    dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
    dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    today: "Сегодня",
    clear: "Очистить",
    dateFormat: "dd.mm.yy",
    weekHeader: "Нед"
    //...
});

interface PlanModalProps {
    plan: Plan | null;
    month: Date;
    show: boolean;
    onClose: () => void;
    onSave: (plan: Plan) => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ plan, month, show, onClose, onSave }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [gypsumBoard, setGypsumBoard] = useState<GypsumBoard | null>(null);
    const { gypsumBoardList, } = GypsumBoardList();
    const [date, setDate] = useState<Date | null>(new Date(month));
    const [minDate, setMinDate] = useState<Date | null>(null);
    const [maxDate, setMaxDate] = useState<Date | null>(null);
    const [newValue, setNewValue] = useState<number>(0);


    const handleHide = () => {
        setNewValue(0);
        setDate(null);
        setGypsumBoard(null);
        setVisible(false);
        onClose();
    };

    const handleSave = () => {
        console.log('In handleSave section');
        if (plan && date && newValue > 0 && gypsumBoard) {
            const newPlan = new Plan(plan.id || 0, date, gypsumBoard, newValue);
            setVisible(false);
            onSave(newPlan);
        }
    };

    // useEffect(() => {
    //     if (show) {
    //         setVisible(true);
    //     } 
    // }, [show]);

    useEffect(() => {
        if (month) {
            const date = new Date(month);
            const start = new Date(date.getFullYear(), date.getMonth(), 1);
            const finish = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            setMinDate(start);
            setMaxDate(finish);
        }
    }, [month]);

    useEffect(() => {
        if (plan) {
            setDate(new Date(plan.planDate));
            setNewValue(plan.planValue);
            setGypsumBoard(plan.gypsumBoard);
        }
    }, [plan]);

    // Функция для форматирования текста в выпадающем списке
    const formatGypsumBoardLabel = (board: GypsumBoard) => {
        return `${board.tradeMark.name} ${board.boardType.name}-${board.edge.name} ${board.thickness.value}-${board.width.value}-${board.length.value} `;
    };

    const footerContent = (
        <div>
            <Button label="Ok" icon="pi pi-check" onClick={handleSave} autoFocus />
        </div>
    );

    return (
        <Dialog
            visible={show}
            onHide={handleHide}
            header="Изменить план"
            footer={footerContent}
            style={{ width: '450px', borderRadius: '8px' }} // округлённые края и заданы размеры
            className="p-fluid" // для растягивания компонентов на 100% внутри контейнера
        >
            {/* Выбор даты с календарем */}
            <div className="p-field" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="date" className="p-d-block" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Выберите дату:
                </label>
                <Calendar
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.value ? e.value : new Date())}
                    showIcon
                    locale="ru"
                    minDate={minDate || new Date()}
                    maxDate={maxDate || new Date()}
                    style={{ width: '100%' }}
                />
            </div>

            {/* Выпадающий список для гипсокартона */}
            <div className="p-field" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="gypsumBoard" className="p-d-block" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Гипсокартон:
                </label>
                <Dropdown
                    id="gypsumBoard"
                    value={gypsumBoard}
                    onChange={(e) => setGypsumBoard(e.value)}
                    options={gypsumBoardList}
                    itemTemplate={(option) => formatGypsumBoardLabel(option)}
                    placeholder="Выберите гипсокартон"
                    valueTemplate={(option) => option ? formatGypsumBoardLabel(option) : 'Выберите гипсокартон'}
                    style={{ width: '100%' }}
                />
            </div>

            {/* Поле для ввода количества */}
            <div className="p-field" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="planValue" className="p-d-block" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Количество:
                </label>
                <InputText
                    id="planValue"
                    keyfilter="pnum"
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    value={newValue.toString()}
                    style={{ width: '100%' }}
                />
            </div>
        </Dialog>

    );
};

export default PlanModal;
