import React from "react";
import { 
    Box, 
    CircularProgress, 
    FormControl, 
    Grid, 
    InputLabel, 
    MenuItem, 
    Paper, 
    Select, 
    Typography 
} from "@mui/material";
import { useConsumption } from "./useConsumption";
import { useSpecificationMutations } from "./useSpecificationMutation";
import { SpecificationTable } from "./SpecificationTable";

export const ConsumptionPage: React.FC = () => {
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

    const {
        updateSpecification,
        removeSpecification,
        addSpecification
    } = useSpecificationMutations();

    const currentProductId = selectedGypsumBoard?.id;

    return (
        <Grid container spacing={3} sx={{ mt: 2, p: 3 }}>
            {/* Левая панель: Выбор гипсокартона */}
            <Grid item xs={12} md={4}>
                <Paper 
                    elevation={3}
                    sx={{
                        p: 3,
                        background: '#ffffff',
                        borderRadius: 3,
                        height: '100%',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#4a5568' }}>
                        Выберите продукт
                    </Typography>
                    
                    <FormControl fullWidth size="medium">
                        <InputLabel id="gypsum-select-label">Гипсокартон</InputLabel>
                        <Select
                            labelId="gypsum-select-label"
                            id="gypsum-select"
                            value={currentProductId ?? ""}
                            disabled={isLoadingBoards}
                            label="Гипсокартон"
                            onChange={handleGypsumChange}
                            sx={{ borderRadius: 2 }}
                            endAdornment={
                                isLoadingBoards ? (
                                    <CircularProgress size={20} sx={{ mr: 3 }} />
                                ) : null
                            }
                        >
                            <MenuItem value="">
                                <em>Не выбрано</em>
                            </MenuItem>
                            {allGypsumBoards.map((board) => (
                                <MenuItem key={board.id} value={board.id}>
                                    {board.toString()}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>
            </Grid>

            {/* Правая панель: Заголовок / Информация */}
            <Grid item xs={12} md={8}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        borderRadius: 3,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 25px rgba(0,0,0,0.1)',
                        }
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                            fontWeight: 600,
                            color: '#1a202c',
                            letterSpacing: '0.5px',
                            m: 0
                        }}
                    >
                        {selectedGypsumBoard ? `Спецификация: ${selectedGypsumBoard.toString()}` : 'Выберите гипсокартон для просмотра спецификации'}
                    </Typography>
                </Paper>
            </Grid>

            {/* Таблица спецификаций */}
            <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                    <SpecificationTable
                        specification={specification}
                        allMaterials={materials}
                        isLoadingSpecification={isLoadingSpecification || isLoadingMaterials}
                        onUpdateQuantity={(materialId, newQuantity) => {
                            if (!currentProductId) return;
                            console.log(`Обновление: ID ${materialId}, новое количество: ${newQuantity}, продукт: ID ${currentProductId}`);
                            updateSpecification({ materialId, quantity: newQuantity, productId: currentProductId });
                        }}
                        onRemoveMaterial={(materialId) => {
                            if (!currentProductId) return;
                            console.log(`Удаление материала с ID ${materialId}, продукт: ID ${currentProductId}`);
                            removeSpecification({ materialId, productId: currentProductId });
                        }}
                        onAddMaterial={(materialId, quantity) => {
                            if (!currentProductId) return;
                            console.log(`Добавление: ID ${materialId}, количество: ${quantity}, продукт: ID ${currentProductId}`);
                            addSpecification({ materialId, quantity, productId: currentProductId });
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};