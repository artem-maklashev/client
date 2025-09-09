export interface ExportColumnTotal {
    [date: string]: number;
}

interface GypsumBoard {
    id: number | string;
    tradeMark?: { name: string };
    boardType?: { name: string };
    edge?: { name: string };
    thickness?: { value: number };
    width?: { value: number };
    length?: { value: number };
}

interface RowData {
    gypsumBoard: GypsumBoard;
    planValue: { [date: string]: number | null };
    factValue: { [date: string]: number | null };
}

export function exportToHTML(
    headers: string[],
    formattedData: RowData[],
    columnTotals: ExportColumnTotal,
    calculateRowTotal: (planValues: { [date: string]: number | null }) => number
) {
    if (!formattedData.length) return;

    const linkHrefs = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .map((l) => (l as HTMLLinkElement).href)
        .filter(Boolean);

    const inlineStyles = Array.from(document.querySelectorAll('style'))
        .map(s => s.innerHTML)
        .join('\n');

    const buildCell = (rowData: RowData, date: string) => {
        const planVal = rowData.planValue?.[date];
        const factVal = rowData.factValue?.[date];
        const planText = planVal != null ? Number(planVal).toLocaleString('ru-RU', { maximumFractionDigits: 0 }) : '';
        const factText = factVal != null ? Number(factVal).toLocaleString('ru-RU', { maximumFractionDigits: 0 }) : '';

        let factColor = 'green';
        if (planVal != null) {
            if (factVal != null ) 
            factColor = planVal < factVal ? 'green' : 'red';
        }

        return `
            <td style="vertical-align: middle; text-align:center; padding:6px;">
                <div style="color: blue; font-weight: 700;">${planText}</div>
                <div style="font-size:10px; color:${factColor};">${factText}</div>
            </td>
        `;
    };

    const rowsHtml = formattedData.map(rowData => {
        const gypsum = rowData.gypsumBoard;
        const gypsumText = `${gypsum.tradeMark?.name ?? ''} ${gypsum.boardType?.name ?? ''}-${gypsum.edge?.name ?? ''} ${gypsum.thickness?.value ?? ''}-${gypsum.width?.value ?? ''}-${gypsum.length?.value ?? ''}`;
        const cells = headers.map(h => buildCell(rowData, h)).join('');
        const rowTotal = calculateRowTotal(rowData.planValue);
        return `
            <tr>
                <td style="min-width:330px; text-align:left; font-weight:700; padding:8px;">${gypsumText}</td>
                ${cells}
                <td style="font-weight:700; text-align:center; padding:6px;">${rowTotal.toLocaleString('ru-RU')}</td>
            </tr>
        `;
    }).join('\n');

    const footerCells = headers.map(h => `<td style="font-weight:700; text-align:center; padding:6px;">${(columnTotals[h] ?? 0).toLocaleString('ru-RU')}</td>`).join('');
    const grandTotal = Object.values(columnTotals).reduce((s, v) => s + v, 0);

    const css = `
        body { font-family: Arial, Helvetica, sans-serif; padding: 16px; color: #111827; }
        table.export-table { border-collapse: collapse; width: 100%; font-size: 12px; }
        table.export-table th, table.export-table td { border: 1px solid #e5e7eb; }
        table.export-table th { background: #f3f4f6; font-weight:600; padding:8px; text-align:center; }
        .footer-row td { background: #f9fafb; }
    `;

    const linksHtml = linkHrefs.map(h => `<link rel="stylesheet" href="${h}">`).join('\n');

    const htmlContent = `
        <!doctype html>
        <html lang="ru">
        <head>
            <meta charset="utf-8" />
            <title>Export Plan Table</title>
            ${linksHtml}
            <style>${inlineStyles}</style>
            <style>${css}</style>
        </head>
        <body>
            <h2>Таблица план / факта</h2>
            <table class="export-table">
                <thead>
                    <tr>
                        <th style="text-align:left; min-width:330px;">Гипсокартон</th>
                        ${headers.map(h => `<th>${h}</th>`).join('')}
                        <th>Итого</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
                <tfoot>
                    <tr class="footer-row">
                        <td style="font-weight:700; text-align:center;">Итого</td>
                        ${footerCells}
                        <td style="font-weight:700; text-align:center;">${grandTotal.toLocaleString('ru-RU')}</td>
                    </tr>
                </tfoot>
            </table>
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
