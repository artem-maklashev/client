import React from "react";
import Plan from "../../../model/gypsumBoard/Plan";
import BoardProduction from "../../../model/production/BoardProduction";

interface GypsumBoardTableProps {
    startDate: string | null;
    endDate: string | null;
}

const PlanFactDinamics: React.FC<GypsumBoardTableProps> = ({ startDate, endDate }) => {
    const [plan, setPlan] = React.useState<Plan[]>([]);
    const [fact, setFact] = React.useState<BoardProduction[]>([]);



    return (
        <div>
            <h1>PlanFactDinamics</h1>
        </div>
    );
};

export default PlanFactDinamics;