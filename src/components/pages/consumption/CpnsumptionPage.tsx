import React from "react";
import { Box, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useConsumption } from "./useConsumption"; // Импортируем нашу логику
import { SpecificationTable } from "./SpecificationTable";

export const ConsumptionPage: React.FC = () => {
    // Достаем нужные данные и функции из кастомного хука
    const {
        allGypsumBoards,
        selectedGypsumBoard,
        handleGypsumChange,
        isLoadingBoards,
        specification,
        isLoadingSpecification,
        materials,
        isLoadingMaterials
    } = useConsumption();

    return (
        <Grid container sx={{ mt: 5, padding: 4 }}>
            <Grid item xs={2}>
                <FormControl fullWidth size="small">
                    <InputLabel id="gypsum-select-label">Гипсокартон</InputLabel>
                    <Select
                        labelId="gypsum-select-label"
                        id="gypsum-select"
                        value={selectedGypsumBoard ? selectedGypsumBoard.id : ""}
                        disabled={isLoadingBoards}
                        label="Гипсокартон"
                        onChange={handleGypsumChange}
                    >
                        <MenuItem value="">
                            <em>Выберите гипсокартон</em>
                        </MenuItem>

                        {allGypsumBoards.map((board) => (
                            <MenuItem key={board.id} value={board.id}>
                                {board.toString()}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>            
            <SpecificationTable
                specification={specification}
                allMaterials={materials} // Массив всех материалов из useMaterials
                isLoadingSpecification={isLoadingSpecification}

                onUpdateQuantity={(materialId, newQuantity) => {
                    // Здесь вызываем API для обновления
                    console.log(`Обновление: ID ${materialId}, новое количество: ${newQuantity}`);
                    // updateMutation.mutate({ materialId, quantity: newQuantity })
                }}

                onRemoveMaterial={(materialId) => {
                    // Здесь вызываем API для удаления
                    console.log(`Удаление материала с ID ${materialId}`);
                }}

                onAddMaterial={(materialId, quantity) => {
                    // Здесь вызываем API для добавления
                    console.log(`Добавление: ID ${materialId}, количество: ${quantity}`);
                }}
            />
        </Grid>
    );
};