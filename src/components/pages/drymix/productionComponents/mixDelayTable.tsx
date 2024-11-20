import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import MixProduction from "../../../../model/mix/prodution/MixProduction";
import MixDelay from "../../../../model/mix/delays/MixDelay";
import MixApiService from "../../../../service/MixApiService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface MixDelayTableProps { 
    mixProduction: MixProduction;
};

const MixDelayTable: React.FC<MixDelayTableProps> = ({ mixProduction }) => {

    const [delays, setDelays] = useState<MixDelay[]>([]);
    
    useEffect(() => {
        const fetchDelays = async () => {
            const result = await MixApiService.getDelaysByProduction(mixProduction);
            setDelays(result);
        }
        if (mixProduction) {
            fetchDelays();
        }
    },[mixProduction]);

    return (
        <Container>
            <Row>
                <DataTable value={delays} size="small">
                    <Column field="delayStart" header="Начало простоя" body={(rowData) => new Date(rowData.delayStart).toLocaleString('ru-RU')} />
                </DataTable>
            </Row>
        </Container>
    ); 
    
}
export default MixDelayTable;