import { useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import ApiService from "../../../service/ApiService";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";

export const ConsumptionPage: React.FC = () => {
    const [allGypsumBoards, setAllGypsumBoards] = useState<GypsumBoard[]>([]);
    useMemo(() => {
        document.title = "Декоратор | Спецификация";
        const fetchAllGypsumBoards = async () => {
            try {
                const boards = await ApiService.fetchGypsumBoards();
                setAllGypsumBoards(boards);
                console.log('All gypsum boards loaded:', boards.length);
            } catch (error) {
                console.error('Error fetching all gypsum boards:', error);
            }
        };

        // Если gypsumBoards пустой или не передан, загружаем все
        if (!allGypsumBoards || allGypsumBoards.length === 0) {
            fetchAllGypsumBoards();
        } else {
            setAllGypsumBoards(allGypsumBoards);
        }   
    }, []);


    return (
        <Container className="p-4">
            <h1>Consumption Page</h1>
            <p>This is the consumption page.</p>
        </Container>
    );
};
