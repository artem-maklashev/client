import React, { useEffect, useState } from "react";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import MaterialConsumption from "../../../../model/specification/MaterialConsumption";
import Specification from "../../../../model/specification/Specification";
import { Modal, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductionList from "../../../../model/production/ProductionList";
import ApiService from "../../../../service/ApiService";


interface EditConsumpionProps {
    show: boolean;
    specifications: Specification[];
    product: GypsumBoard | null;
    produtionList: ProductionList;
    productionTotal: number;
    onHide: () => void;
    // onSave: (updatedConsumptions: MaterialConsumption[]) => void;
}

const EditConsumptionModal: React.FC<EditConsumpionProps> = ({
    show, specifications, product, productionTotal, produtionList, onHide
}) => {
    const [specification, setSpecification] = useState<Specification[]>(specifications);
    const [draftConsumption, setDraftConsumption] = useState<MaterialConsumption[]>([]);

    useEffect(() => {
        console.log(specifications);
        if (specifications) {
            specification.sort((a,b) => a.material.id - b.material.id);
            setSpecification(specifications);
        }
    }, [specification, specifications]);

    useEffect(() =>{
        const fetchConsumptionData = async () => {
            if (produtionList) {
                const data = await ApiService.fetchConsumption(produtionList);
                return data;            
            } else 
            {
                specification.forEach((item) => {
                let newConsumption = new MaterialConsumption(-1, new ProductionList(-1, new Date(), new Date(),), item.material, 0)
            })
                return [];
            }
        }

        const getConsumption = async () => {
            const consumption = await fetchConsumptionData();
            setDraftConsumption(consumption);
        }
        getConsumption();
    }, [produtionList]);

    return (
        <Modal show={show} onHide={onHide} scrollable={true} animation={true} 	aria-labelledby="dark"
>
            <Modal.Header closeButton={true} data-bs-theme="light">
                <Modal.Title>Расход материалов</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover size="sm" variant="dark" >
                    <thead>
                        <tr>
                            <th>Наименование</th>
                            <th>Норма</th>
                            <th>По норме</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specification.length > 0 ?
                            (
                                specification.map((entry) => (
                                    <tr key={entry.id}>
                                        <td>{entry.material.name}</td>
                                        <td>{entry.quantity}</td>
                                        <td>{(entry.quantity*productionTotal).toFixed(2)}</td>
                                    </tr>
                                )
                                )
                            ) : (

                                <tr>
                                    <td colSpan={2}>Нет данных</td>
                                </tr>

                            )}
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
}
export default EditConsumptionModal;