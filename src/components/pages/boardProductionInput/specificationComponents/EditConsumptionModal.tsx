import React, { useEffect, useState } from "react";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import MaterialConsumption from "../../../../model/specification/MaterialConsumption";
import Specification from "../../../../model/specification/Specification";
import { Modal, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductionList from "../../../../model/production/ProductionList";
import ApiService from "../../../../service/ApiService";
import Material from "../../../../model/specification/Material";
import { Button, TextField } from "@mui/material";
import { get } from "http";
import { getUserRole } from "../../../../service/Api";


interface EditConsumpionProps {
    show: boolean;
    specifications: Specification[];
    product: GypsumBoard | null;
    produtionList: ProductionList;
    productionTotal: number;
    onHide: () => void;
    onSave: (updatedConsumptions: MaterialConsumption[]) => void;
}

const EditConsumptionModal: React.FC<EditConsumpionProps> = ({
    show, specifications, product, productionTotal, produtionList, onHide, onSave
}) => {
    const [specification, setSpecification] = useState<Specification[]>(specifications);
    const [draftConsumption, setDraftConsumption] = useState<MaterialConsumption[]>([]);

    useEffect(() => {
        console.log(specifications);
        if (specifications) {
            specification.sort((a, b) => a.material.id - b.material.id);
            setSpecification(specifications);
        }
    }, [specification, specifications]);

    useEffect(() => {
        const fetchConsumptionData = async () => {
            if (produtionList) {
                const data = await ApiService.fetchConsumption(produtionList);
                if (data.length > 0) {
                    return data;
                } else {
                    const newConsumptionList: MaterialConsumption[] = [];
                    specification.forEach((item) => {
                        let newConsumption = new MaterialConsumption(-1, produtionList, item.material, 0);
                        newConsumptionList.push(newConsumption);
                    })
                    return newConsumptionList;
                }
            } else {
                    const newConsumptionList: MaterialConsumption[] = [];
                    specification.forEach((item) => {
                        let newConsumption = new MaterialConsumption(-1, new ProductionList(), item.material, 0);
                        newConsumptionList.push(newConsumption);
                    })
                    return  newConsumptionList;
                }
            }

            const getConsumption = async () => {
                const consumption = await fetchConsumptionData();
                setDraftConsumption(consumption);
            }
            getConsumption();
    }, [produtionList]);
    
    const getMaterialConsumption = (material: Specification) => {
        const factQuantity = draftConsumption.find(item => item.$material.id === material.id)?.$quantity;
        if (!factQuantity) {
            // draftConsumption.push(new MaterialConsumption(-1, produtionList, material.material, 0));
            return 0;
        }
        return factQuantity;
    }

    function handleHide(): void {
        setDraftConsumption([]);
        setSpecification([]);
        onHide();
    }

    const getDifference = (entry: Specification) => {
        return getMaterialConsumption(entry) - entry.quantity*productionTotal;
    }
    
    const handleMaterialConsumptionChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, entry: Specification) => {
        const updatedConsumption = draftConsumption.map((item) =>
            item.$material.id === entry.material.id 
                ? new MaterialConsumption(item.$id, item.$productionList, item.$material, Number(event.target.value))
                : item
        );
        setDraftConsumption(updatedConsumption);
       }
   

    function handleSave(): void {
       onSave(draftConsumption);
    }

    return (
        <Modal show={show} onHide={handleHide} scrollable={true} animation={true} aria-labelledby="dark" size="lg"
        >
            <Modal.Header closeButton={true} data-bs-theme="light">
                <Modal.Title>Расход материалов</Modal.Title>
                <p>{ draftConsumption.length}</p>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover size="sm" variant="dark" >
                    <thead>
                        <tr>
                            <th>Наименование</th>
                            <th>Норма</th>
                            <th>По норме</th>
                            <th>Факт</th>
                            <th>Отклонение</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specification.length > 0 ?
                            (
                                specification.map((entry) => (
                                    <tr key={entry.id}>
                                        <td>{entry.material.name}</td>
                                        <td>{entry.quantity}</td>
                                        <td>{(entry.quantity * productionTotal).toFixed(2)}</td>
                                        <td>
                                            {/* <Button color="primary" onClick={() => handleConsumptionUpdate(entry)}>
                                                🖊
                                            </Button> */}
                                            <TextField
                                            id="outlined-number"
                                            // label="Значение"
                                            type="number"
                                            color="primary"                                            
                                            defaultValue={getMaterialConsumption(entry)}
                                            size="small"
                                            onChange={(event) => handleMaterialConsumptionChange(event, entry)}                                            
                                            InputProps={{
                                                style: { color: 'white' }}}/>
                                            </td>
                                        <td
                                        style={getDifference(entry) > 0 ? {color: 'red'} : {color: 'green'}}
                                        >{getDifference(entry).toFixed(2)}</td>
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
            <Modal.Footer>
            <Button onClick={onHide} color="primary" >
                    Отмена
                </Button>
                <Button variant="contained" onClick={handleSave} disabled={getUserRole() === 'USER' || getUserRole() === 'ADMIN' ? false : true}>
                    Сохранить
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
export default EditConsumptionModal;