import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import Shift from "../../../model/Shift";
import { fetchShiftList } from "../boardProductionInput/productComponents/FetchShiftList";

interface ShiftSelectorProps {
    shift: Shift | null;
    handleShiftChange: (shift: Shift) => void;
}

const ShiftSelector: React.FC<ShiftSelectorProps> = ({ handleShiftChange, shift }) => {
    const [selectedShift, setSelectedShift] = useState<Shift | null>(shift);
    const [shiftList, setShiftList] = useState<Shift[]>([]);
    const [errorText, setErrorText] = useState<string | null>(null);

    useEffect(() => {
        console.log("Received shift:", shift);
        
        const fetchData = async () => {
            const { shiftList, errorText } = await fetchShiftList();
            setShiftList(shiftList);
            setErrorText(errorText);

            // Если shift не передан, установим первый доступный из списка
            if (!shift && shiftList.length > 0) {
                const initialShift = shiftList[0];
                setSelectedShift(initialShift);
                handleShiftChange(initialShift); 
            } else if (shift) {
                setSelectedShift(shift);
            }
        };
        fetchData();
    }, [shift, handleShiftChange]); // Зависимость от shift для синхронизации с пропсом

    return (
        <Col className="col-lg-2 col-sm-6 bordered mt-2">
            <Form.Group>
                <Form.Label>Смена</Form.Label>
                {errorText ? (
                    <p>{errorText}</p>
                ) : (
                    <Form.Select
                        value={selectedShift ? selectedShift.name : ""}
                        onChange={(e) => {
                            const selectedShiftName = e.target.value;
                            const foundShift = shiftList.find(
                                (shift) => shift.name === selectedShiftName
                            );
                            setSelectedShift(foundShift || null);
                            if (foundShift) {
                                handleShiftChange(foundShift);
                            }
                        }}
                        size="sm"
                    >
                        {shiftList.map((shift) => (
                            <option key={shift.id} value={shift.name}>
                                {shift.name}
                            </option>
                        ))}
                    </Form.Select>
                )}
            </Form.Group>
        </Col>
    );
};

export default ShiftSelector;
