import { Dialog } from "primereact/dialog";
import React from "react";
import { useState } from "react";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import { GypsumBoardList } from "../boardProductionInput/productComponents/FetchGypsumBoard";
import { Dropdown } from "primereact/dropdown";

interface PlanModalProps {
    show: boolean;
    onClose: () => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ show, onClose }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [gypsumBpard, setGypsumBoard] = useState<GypsumBoard | null>(null);
    const gypsumBoardList = GypsumBoardList();
    
    const handleHide = () => {
        setVisible(false);
        onClose();
    }

    return (
        <Dialog visible={visible} onHide={handleHide}>
            <Dropdown value={gypsumBpard} onChange={(e) => setGypsumBoard(e.value as GypsumBoard)} />
        </Dialog>
    );
}
export default PlanModal;