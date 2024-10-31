import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";
import { Row } from "primereact/row";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import MixPlan from "../../../../model/mix/plan";
import DryMix from "../../../../model/mix/DryMix";
import ApiService from "../../../../service/ApiService";
import MixApiService from "../../../../service/MixApiService";

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

interface MixPlanModalProps {
    plan: MixPlan | null;
    month: Date;
    show: boolean;
    onClose: () => void;
    onSave: (plan: MixPlan) => void;
}

const MixPlanModal: React.FC<MixPlanModalProps> = ({ plan, month, show, onClose, onSave }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [mix, setMix] = useState<DryMix | null>(null);
    const [date, setDate] = useState<Date | null>(new Date(month));
    const [minDate, setMinDate] = useState<Date | null>(null);
    const [maxDate, setMaxDate] = useState<Date | null>(null);
    const [newValue, setNewValue] = useState<number>(0);
    const [mixList, setMixList] = useState<DryMix[]>([]);

    const getMixList = async () => {
        return await MixApiService.MixList();
        
    };
    
    useEffect(() => {
        getMixList().then((list) => {
            console.log("Список смесей:", list);
            setMixList(list);
        });
    }, [date]);


    const handleHide = () => {
        setNewValue(0);
        setDate(null);
        setMix(null);
        setVisible(false);
        onClose();
    };

    const handleSave = () => {
        console.log('In handleSave section');
        if (date && newValue > 0 && mix) {
            const localDate = (ApiService.removeTimeZone(date)); 
            const newPlan = new MixPlan(plan?.id || 0, localDate, mix, newValue);
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
            setNewValue(plan.value);
            setMix(plan.mix);
        }
    }, [plan]);

    // Функция для форматирования текста в выпадающем списке
    const formatMixLabel = (mix: DryMix) => {
        return `${mix.tradeMark.name} ${mix.dryMixType.name}
                    ${mix.binder.name} ${mix.name}`;
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
            style={{ width: '650px', borderRadius: '8px' }} // округлённые края и заданы размеры
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

            {/* Выпадающий список */}
            <div className="p-field" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="dryMix" className="p-d-block" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Сухая смесь:
                </label>
                <Dropdown
                    id="dryMix"
                    value={mix}
                    onChange={(e) => setMix(e.value)}
                    options={mixList}
                    itemTemplate={(option) => formatMixLabel(option)}
                    placeholder="Выберите смесь"
                    valueTemplate={(option) => option ? formatMixLabel(option) : 'Выберите смесь'}
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

export default MixPlanModal;
