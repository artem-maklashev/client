import React, {useCallback, useEffect, useState} from "react";
import GypsumBoardInputData from "../../../model/inputData/GypsumBoardInputData";

interface GypsumBoardPlanFactTableProps {
    monthIndex: number;
    year: number;
    }

export function GypsumBoardPlanFactTable(monthIndex: number, year: number): any {
    const GypsumBoardShow: React.FC<GypsumBoardPlanFactTableProps> = () => {
        const [gypsumBoardData, setGypsumBoardData] = useState<GypsumBoardInputData[]>([]);
        const [isLoading, setIsLoading] = useState<boolean>(true);
        const [errorText, setErrorText] = useState<string | null>(null);



        const fetchGypsumBoardData = useCallback(async () => {
            try {
                setIsLoading(true);
                const params = new URLSearchParams({
                    month: monthIndex.toString(),
                    year: year.toString(),
                });

                const response = await fetch(`http://localhost:8080/api/allboard?${params.toString()}`);

                if (!response.ok) {
                    throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
                }

                const data: GypsumBoardInputData[] = await response.json();
                setErrorText(null);
                setGypsumBoardData(data);
            } catch (error: any) {
                console.error(`Произошла ошибка: ${error.message}`);
                setErrorText(error.message);
                setGypsumBoardData([]);
            } finally {
                setIsLoading(false);
            }
        }, [monthIndex, year]);

        useEffect(() => {
            fetchGypsumBoardData();
        }, [fetchGypsumBoardData]);

        const calculateTotal = <K extends keyof GypsumBoardInputData>(data: GypsumBoardInputData[], property: K): number => {
            return data.reduce((total, item) => total + Number(item[property]), 0);
        };

        const calculatePercentageTotal = (data: GypsumBoardInputData[]): string => {
            const totalFact = calculateTotal(data, 'factValue');
            const totalTotal = calculateTotal(data, 'total');
            return totalTotal > 0 ? (((totalTotal - totalFact) * 100) / totalTotal).toFixed(2) + "%" : "---";
        };

        return (
            <div className="container">
                <div className="row">
                    <div className="col-7">
                        <div className="table-responsive-sm">
                            <table className="table table-striped table-bordered table-hover table-auto"
                                   id="gypsumBoardTable">
                                <thead className="table-dark">
                                <tr>
                                    <th>Гипсокартон</th>
                                    <th>План</th>
                                    <th>Факт</th>
                                    <th>Процент брака</th>
                                </tr>
                                </thead>
                                <tbody>
                                {gypsumBoardData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.boardTitle}</td>
                                        <td>{item.planValue}</td>
                                        <td>{item.factValue}</td>
                                        <td>{item.total > 0 ? ((item.total - item.factValue) * 100 / item.total).toFixed(2) + "%" : "---"}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td><strong>Итого</strong></td>
                                    <td><strong>{calculateTotal(gypsumBoardData, 'planValue')}</strong></td>
                                    <td><strong>{calculateTotal(gypsumBoardData, 'factValue')}</strong></td>
                                    <td><strong>{calculatePercentageTotal(gypsumBoardData)}</strong></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

let monthIndex =3;
let year = 2023;
export default GypsumBoardPlanFactTable(monthIndex, year);