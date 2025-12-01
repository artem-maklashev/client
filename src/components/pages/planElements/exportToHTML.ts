export function exportToHTML(
    headers: string[],
    formattedData: any[],
    planTotals: { [date: string]: number },
    factTotals: { [date: string]: number },
    deviationTotals: { [date: string]: number },
    calculateRowTotal: (values: { [date: string]: number | null }) => number
) {
    if (!formattedData.length) return;

    const buildCell = (rowData: any, date: string) => {
        const planVal = rowData.planValue?.[date] ?? 0;
        const factVal = rowData.factValue?.[date] ?? 0;
        const deviation = factVal - planVal;

        const planText = planVal ? `п ${planVal.toLocaleString('ru-RU')}` : '';
        const factText = factVal ? `ф ${factVal.toLocaleString('ru-RU')}` : '';
        const deviationText = factVal ? `откл. ${deviation.toLocaleString('ru-RU')}` : '';

        const deviationColor = planVal < factVal ? 'green' : 'red';

        return `
            <td style="vertical-align: middle; text-align:center; padding:6px;">
                <div style="color: blue; font-weight: 700;">${planText}</div>
                <div style="font-size:10px; color:${deviationColor};">${factText}</div>
                <div style="font-size:8px; color:${deviationColor};">${deviationText}</div>
            </td>
        `;
    };

    const rowsHtml = formattedData.map(rowData => {
        const gypsum = rowData.gypsumBoard;
        const gypsumText = `${gypsum.tradeMark?.name ?? ''} ${gypsum.boardType?.name ?? ''}-${gypsum.edge?.name ?? ''} ${gypsum.thickness?.value ?? ''}-${gypsum.width?.value ?? ''}-${gypsum.length?.value ?? ''}`;
        const cells = headers.map(h => buildCell(rowData, h)).join('');
        const rowPlanTotal = calculateRowTotal(rowData.planValue);
        const rowFactTotal = calculateRowTotal(rowData.factValue);
        const rowDeviationTotal = rowFactTotal - rowPlanTotal;

        return `
            <tr>
                <td style="min-width:330px; text-align:left; font-weight:700; padding:8px; 
                           position: sticky; left: 0; background: white; z-index: 2; 
                           border-right: 2px solid #e5e7eb;">
                    ${gypsumText}
                </td>
                ${cells}
                <td style="font-weight:700; text-align:center; padding:6px;">${rowPlanTotal.toLocaleString('ru-RU')}</td>
                <td style="font-weight:700; text-align:center; padding:6px;">${rowFactTotal.toLocaleString('ru-RU')}</td>
                <td style="font-weight:700; text-align:center; padding:6px;">${rowDeviationTotal.toLocaleString('ru-RU')}</td>
            </tr>
        `;
    }).join('\n');

    const footerCells = headers.map(h => `
        <td style="text-align:center; font-weight:700; padding:6px;">
            <div style="color: blue;">${planTotals[h]?.toLocaleString('ru-RU') ?? 0}</div>
            <div style="font-size:10px; color:green;">${factTotals[h]?.toLocaleString('ru-RU') ?? 0}</div>
            <div style="font-size:8px; color:${(factTotals[h] ?? 0) >= (planTotals[h] ?? 0) ? 'green' : 'red'};">
                ${(deviationTotals[h] ?? 0).toLocaleString('ru-RU')}
            </div>
        </td>
    `).join('');

    const grandPlanTotal = Object.values(planTotals).reduce((s, v) => s + v, 0);
    const grandFactTotal = Object.values(factTotals).reduce((s, v) => s + v, 0);
    const grandDeviationTotal = grandFactTotal - grandPlanTotal;

    const htmlContent = `
        <!doctype html>
        <html lang="ru">
        <head>
            <meta charset="utf-8" />
            <title>Export Plan Table</title>
            <style>
                body { 
                    font-family: Arial, Helvetica, sans-serif; 
                    padding: 16px; 
                    color: #111827; 
                    margin: 0;
                }
                .table-container {
                    overflow-x: auto;
                    width: 100%;
                    border: 1px solid #e5e7eb;
                    border-radius: 4px;
                }
                table.export-table { 
                    border-collapse: collapse; 
                    width: max-content; /* важно для прокрутки */
                    min-width: 100%;
                    font-size: 12px; 
                }
                table.export-table th, 
                table.export-table td { 
                    border: 1px solid #e5e7eb; 
                    white-space: nowrap;
                }
                table.export-table th { 
                    background: #f3f4f6; 
                    font-weight: 600; 
                    padding: 8px; 
                    text-align: center; 
                }
                /* Закрепляем заголовок первого столбца */
                .sticky-header {
                    position: sticky;
                    left: 0;
                    background: #f3f4f6;
                    z-index: 2;
                    text-align: left;
                    min-width: 330px;
                    border-right: 2px solid #e5e7eb;
                }
                .footer-row td { 
                    background: #f9fafb; 
                }
            </style>
        </head>
        <body>
            <h2>Таблица план / факта</h2>
            <div class="table-container">
                <table class="export-table">
                    <thead>
                        <tr>
                            <th class="sticky-header">Гипсокартон</th>
                            ${headers.map(h => `<th>${h}</th>`).join('')}
                            <th>Итого план</th>
                            <th>Итого факт</th>
                            <th>Отклонение</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                    <tfoot>
                        <tr class="footer-row">
                            <td style="font-weight:700; text-align:center; 
                                       position: sticky; left: 0; background: #f9fafb; z-index: 1;
                                       border-right: 2px solid #e5e7eb;">
                                Итого
                            </td>
                            ${footerCells}
                            <td style="font-weight:700; text-align:center;">${grandPlanTotal.toLocaleString('ru-RU')}</td>
                            <td style="font-weight:700; text-align:center;">${grandFactTotal.toLocaleString('ru-RU')}</td>
                            <td style="font-weight:700; text-align:center;">${grandDeviationTotal.toLocaleString('ru-RU')}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </body>
        </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `plan_table_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
}