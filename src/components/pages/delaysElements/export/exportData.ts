// Поместите эту функцию внутри компонента DelaysTable или вне его (лучше вне)
const prepareExportData = (
  unitData: Record<string, any[]>, 
  delaysSummary: Record<string, number>, 
  planDuration: number,
  formatPercentage: (value: number, total: number) => string
) => {
  const exportData: any[] = [];
  
  // Добавляем заголовок с периодом (опционально)
  // exportData.push({ "Отчет по простоям": "", "Период": `${minDate} - ${maxDate}` }]);
  // exportData.push({}); // Пустая строка для разделения

  // Обрабатываем каждую группу данных
  Object.entries(unitData).forEach(([delayType, tableData]) => {
    // Заголовок группы
    exportData.push({ "Тип простоя": delayType });
    exportData.push({}); // Пустая строка

    // Заголовки столбцов
    exportData.push({
      "Участок": "Участок",
      "Узел": "Узел", 
      "Деталь": "Деталь",
      "Длительность (мин)": "Длительность (мин)",
      "%": "%"
    });

    // Данные таблицы
    tableData.forEach(item => {
      exportData.push({
        "Участок": item.unitPart.unit.productionArea.name,
        "Узел": item.unitPart.unit.name,
        "Деталь": item.unitPart.name,
        "Длительность (мин)": item.delta,
        "%": formatPercentage(item.delta, planDuration)
      });
    });

    // Итоговая строка
    exportData.push({
      "Участок": "",
      "Узел": "",
      "Деталь": "Итого:",
      "Длительность (мин)": delaysSummary[delayType],
      "%": formatPercentage(delaysSummary[delayType], planDuration)
    });

    // Пустая строка между группами
    exportData.push({});
  });

  return exportData;
};
export default prepareExportData;