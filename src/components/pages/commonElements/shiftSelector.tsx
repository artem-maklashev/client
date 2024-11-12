import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import Shift from "../../../model/Shift";
import { fetchShiftList } from "../boardProductionInput/productComponents/FetchShiftList";

interface ShiftSelectorProps {
    handleShiftChange: (shift: Shift) => void;
}

const ShiftSelector: React.FC<ShiftSelectorProps> = ({ handleShiftChange }) => {
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [shiftList, setShiftList] = useState<Shift[]>([]);
    const [errorText, setErrorText] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { shiftList, errorText } = await fetchShiftList();
            setShiftList(shiftList);
            setErrorText(errorText);

            if (!selectedShift && shiftList.length > 0) {
                setSelectedShift(shiftList[0]);
                handleShiftChange(shiftList[0]); // Передаем начальную смену
            }
        };
        fetchData();
    }, []);

   

    return (
        <Col className="col-lg-2 col-sm-6 bordered mt-2">
            <Form.Group>
                <Form.Label>Смена</Form.Label>
                {errorText ? (
                    <p>{errorText}</p>
                ) : (
                    <Form.Select
                        value={selectedShift ? selectedShift.name : shiftList[0]?.name || ""}
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
