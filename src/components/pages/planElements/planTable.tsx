import React from "react";
import Plan from "../../../model/gypsumBoard/Plan";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface PlanTableProps {
    planList: Plan[];
}

const PlanTable: React.FC<PlanTableProps> = ({ planList }) => {
    return (
        <div>
            {/* {planList.map((plan) => (
                <div key={plan.id}>{plan.gypsumBoard.toString()}</div>
            ))} */}
            <DataTable value={planList} scrollable scrollHeight="400px">
                <Column field="planDate" header="Date" />
                <Column
                    header="Gypsum Board"
                    body={(rowData) => `${rowData.gypsumBoard.tradeMark.name} ${rowData.gypsumBoard.boardType.name}-${rowData.gypsumBoard.edge.name}
                ${rowData.gypsumBoard.thickness.value}-${rowData.gypsumBoard.width.value}-${rowData.gypsumBoard.length.value}`}
                />
                <Column field="planValue" header="Plan Value" />
            </DataTable>
        </div>
    );
};
export default PlanTable;