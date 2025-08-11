import { Dispatch, SetStateAction } from "react";
import * as XLSX from "xlsx";
import prepareExportData from "./export/exportData";

interface HookParams {
  unitData: any;
  delaysSummary: any;
  planDuration: number;
  minDate: Date;
  maxDate: Date;
  formatPercentage: (v: number, t: number) => string;
  setIsExporting: Dispatch<SetStateAction<boolean>>;
  setIsPrinting: Dispatch<SetStateAction<boolean>>;
}

export default function useDelaysExportAndPrint({
  unitData,
  delaysSummary,
  planDuration,
  minDate,
  maxDate,
  formatPercentage,
  setIsExporting,
  setIsPrinting
}: HookParams) {
  const handleExport = () => {
    setIsExporting(true);
    try {
      const exportData = prepareExportData(unitData, delaysSummary, planDuration, formatPercentage);
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      ws["!cols"] = [{ wch: 20 }, { wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 10 }];
      XLSX.utils.book_append_sheet(wb, ws, "Простои");
      const fileName = `Отчет_по_простоям_${minDate.toLocaleDateString().replace(/\./g, "-")}_${maxDate.toLocaleDateString().replace(/\./g, "-")}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setTimeout(() => setIsPrinting(false), 1000);
  };

  return { handleExport, handlePrint };
}
