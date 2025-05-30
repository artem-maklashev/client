import React from "react";
import BoardProduction from "../../../model/production/BoardProduction";
import Shift from "../../../model/Shift";

interface DefectsByShiftProps {
    production: BoardProduction[];
}

interface ByDayDefects {
    day: string;
    total: number;
    fact: number;  
    defectsPercentage: number;
}

const DefectsByShift: React.FC<DefectsByShiftProps> = ({production}) => {
    const uniqueShifts = production.reduce(
        (acc: Shift[], curr) => {
            
            if (!acc.includes(curr.productionList.shift)) {
                acc.push(curr.productionList.shift);
            }
            return acc.sort((a, b) => a.id - b.id);
        },
        []
    );

    const precentage = (bp: BoardProduction[]) => {
        const result:ByDayDefects[]  = [];
        if (bp.length !== 0) {
            bp.forEach(p => {
                const StrDate =new Date( p.productionList.productionDate).toISOString().split('T')[0];
                const existingEntry = result.find(r => r.day === StrDate);
                if (!existingEntry) {
                    result.push({day: StrDate, total: 0, fact: 0, defectsPercentage: 0});
                } else {
                    if (p.category.id === 1) {
                        existingEntry.total += p.value;
                    } else {
                        if (p.category.id === 2 || p.category.id === 3 || p.category.id === 4)
                        existingEntry.fact += p.value;
                    }}
                }
                
                
            );
            result.forEach(r => {
                r.defectsPercentage =1 - r.fact / r.total;
            });
        }
        return result;
    }


        
return (
        <div>
            <h2>Defects by Shift</h2>
            {uniqueShifts.map(shift => (
                <div key={shift.id}>
                    <h3>Смена {shift.name}</h3>
                    {precentage(production.filter(p => p.productionList.shift.id === shift.id)).map(d => (
                        <div key={d.day}>
                            <p>Day: {d.day}</p>
                            <p>Total: {d.total}</p>
                            <p>Fact: {d.fact}</p>
                            <p>Defects Percentage: {d.defectsPercentage}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
export default DefectsByShift;