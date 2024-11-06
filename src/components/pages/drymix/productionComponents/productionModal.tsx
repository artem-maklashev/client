import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import MixCategoryProduction from "../../../../model/mix/prodution/MixCategoryProduction";

interface ProductionModalProps { 
    show: boolean;
    handleClose: () => void;
    editProduction: MixCategoryProduction | null;
};

const ProductionModal: React.FC<ProductionModalProps> = ({show, handleClose, editProduction}) => {
    
    const [open, setOpen] = useState<boolean>(false);
    const [production, setProduction] = useState<MixCategoryProduction | null>(null);

    useEffect(() => {
        if (production) {
            setProduction(production);

        }
        setOpen(show);
    }, [show]);
    
    
    return (
        <Modal show={open} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ввод данных</Modal.Title>
            </Modal.Header>
            <Modal.Body>                
                ProductionModal
             </Modal.Body>
        </Modal>
    )

}
export default ProductionModal;