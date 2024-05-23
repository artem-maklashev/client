import { useCallback, useEffect, useState } from "react";
import GypsumBoard from "../../../../model/gypsumBoard/GypsumBoard";
import { api } from "../../../../service/Api";
import Division from "../../../../model/delays/Division";
import ProductionArea from "../../../../model/delays/ProductionArea";


class FetchDelaysData {
    async getDivisions() {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/division`);
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
            return response.data;
        }catch (error) {
            console.error('Ошибка при получении данных о узле', error);
            throw error; 
        }
    }
    async getUnitPart(id: number) {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/unitPart/${id}`);
            return response.data;
        }catch (error) {
            console.error('Ошибка при получении данных о детали', error);
            throw error; 
        }
    }
    async getDelayTypes() {
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/delayType`);
            return response.data;
        }catch (error) {
            console.error('Ошибка при получении данных о детали', error);
            throw error; 
        }
    }



}
export default FetchDelaysData;