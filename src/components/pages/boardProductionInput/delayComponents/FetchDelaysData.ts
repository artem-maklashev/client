import { useCallback, useEffect, useState } from "react";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import { api } from "../../../../service/Api";
import Division from "../../../../model/delays/Division";
import ProductionArea from "../../../../model/delays/ProductionArea";
import Unit from "../../../../model/delays/Unit";
import UnitPart from "../../../../model/delays/UnitPart";
import DelayType from "../../../../model/delays/DelayType";


class FetchDelaysData {
    async getDivisions(): Promise<Division[]> {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/division`);
            console.log("Получены подразделения: " + JSON.stringify(response.data));
            return response.data as Division[];
        } catch (error) {
            console.error('Ошибка при получении данных о дивизиях', error);
            throw error; // Вы можете обработать ошибку в компоненте, который использует этот класс
        }
    }
    async getProductionArea(id: number) {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/productionArea/${id}`);            
            return response.data as ProductionArea[];
        } catch (error) {
            console.error('Ошибка при получении данных о производственных зонах', error);
            throw error; 
        }
    
    }
    async getUnit(id: number) {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/unit/${id}`);
            return response.data as Unit[];
        }catch (error) {
            console.error('Ошибка при получении данных о узле', error);
            throw error; 
        }
    }
    async getUnitPart(id: number) {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/unitPart/${id}`);
            return response.data as UnitPart[];
        }catch (error) {
            console.error('Ошибка при получении данных о детали', error);
            throw error; 
        }
    }
    async getDelayTypes(): Promise<DelayType[]> {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/delayType`);
            console.log("Получены типы простоев: " + JSON.stringify(response.data));
            return response.data;
        }catch (error) {
            console.error('Ошибка при получении данных о детали', error);
            throw error; 
        }
    }



}
export default FetchDelaysData;