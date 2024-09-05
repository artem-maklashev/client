import React, { useEffect, useState } from "react";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import BoardProduction from "../../../model/production/BoardProduction";
import ApiService from "../../../service/ApiService";
import MaterialConsumption from "../../../model/specification/MaterialConsumption";
import Material from "../../../model/specification/Material";

interface ConsumptionChartProps {
    startDate: Date;
    endDate: Date;
    gypsumBoard: GypsumBoard;
    material: Material;
}

interface ChartData {
    
    // date: string;
    productionValue: number;
    consumption: number;
    consumptionPerSquare: number;
    rate: number;

}

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ startDate, endDate, gypsumBoard, material }) => {
    const [productions, setProduction] = useState<BoardProduction[]>([]);
    const [consumptions, setConsumptions] = useState<MaterialConsumption[]>([]);
    const [data, setData] = useState<{ [date: string]: ChartData }>({});

    useEffect(() => {
        if (gypsumBoard) {
            const fetchProduction = async () => {
                const production = await ApiService.fetchBoardProductionByGypsumBoardAndDate(
                    gypsumBoard.id,
                    startDate,
                    endDate
                );
                setProduction(production);
            }
        
            if (productions.length === 0) {
                fetchProduction();
            }
        }
    }, [startDate, endDate, gypsumBoard ]);

    useEffect(() => {
        if (material) {
            const fetchConsumption = async () => {
                const consumption = await ApiService.fetchConsumptionsByDateAndMaterial(
                    startDate,
                    endDate,
                    material.id
                );
                setConsumptions(consumption);
            }

            if (consumptions.length === 0) {
                fetchConsumption();
            }
        }

    }, [startDate, endDate, material]);

    const processData = (
        productions: BoardProduction[],
        consumptions: MaterialConsumption[]
    ): { [date: string]: ChartData } => {
        const draftData: { [date: string]: ChartData } = {};

        productions.forEach((production) => {
            const date = new Date(production.productionList.productionDate).toISOString().split("T")[0];
            const consumption = consumptions.find(c => c.productionList.id === production.productionList.id)?.quantity || 0;
            const existingData = draftData[date];

            if (existingData) {
                existingData.productionValue += production.value;
                existingData.consumption += consumption;
            } else {
                draftData[date] = {
                    productionValue: production.value,
                    consumption,
                    consumptionPerSquare: 0,
                    rate: 0
                };
            }
        });

        Object.keys(draftData).forEach((date) => {
            const data = draftData[date];
            data.consumptionPerSquare = data.productionValue !== 0 ? data.consumption / data.productionValue : 0;
        });

        return draftData;
    };
    
    
    useEffect(() => {
        if (productions.length > 0 && consumptions.length > 0) {
            const draftData = processData(productions, consumptions);
            console.log(Object.keys((draftData).length));
        }
    }, [consumptions, productions]);



    return (
        <div>
            <h1>Consumption Chart</h1>
            <h2>{}</h2>
        </div>
    )

}
export default ConsumptionChart;