import { useCallback, useEffect, useMemo, useState } from "react";
import ProductTypes from "../../../model/ProductTypes";
import ReportData from "../../../model/ReportData";
import Shift from "../../../model/Shift";
import GypsumBoard from "../../../model/gypsumBoard/GypsumBoard";
import BoardProduction from "../../../model/production/BoardProduction";
import ProductionList from "../../../model/production/ProductionList";
import FetchCategories from "./productComponents/FetchCategories";

export async function createNewReport(shift: Shift, product: GypsumBoard) {
    // Логика для создания нового отчета, без использования хуков
    const productionList = new ProductionList(
      -1,
      new Date(),
      new Date(),
      new Date(),
      shift,
      new ProductTypes(1, "ГСП")
    );
    
    const fetcher = new FetchCategories();
  const categories = await fetcher.getCategories();
  const productions: BoardProduction[] = [];
  categories.forEach(category => {
    productions.push(new BoardProduction(-1, productionList, product, category, 0));
  });
  return new ReportData(product, productionList, productions, []);
}