import React, { useState, useMemo } from 'react';
import GypsumBoardInputData from '../../../model/inputData/GypsumBoardInputData';

interface GypsumBoardFactTableProps {
    data: GypsumBoardInputData[];
}

type SortKey = 'boardTitle' | 'factValue';

const GypsumBoardFactTable: React.FC<GypsumBoardFactTableProps> = ({ data }) => {
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
        key: 'factValue',
        direction: 'desc',
    });

    const handleSort = (key: SortKey) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            if (typeof aVal === 'string') {
                const cmp = (aVal as string).localeCompare(bVal as string, 'ru-RU');
                return sortConfig.direction === 'asc' ? cmp : -cmp;
            }

            const diff = Number(aVal || 0) - Number(bVal || 0);
            return sortConfig.direction === 'asc' ? diff : -diff;
        });
    }, [data, sortConfig]);

    const totalFact = useMemo(() => {
        return data.reduce((sum, item) => sum + (Number(item.factValue) || 0), 0);
    }, [data]);

    const SortIcon = ({ columnName }: { columnName: SortKey }) => {
        if (sortConfig.key === columnName) {
            return (
                <span className="ms-1 small">
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                </span>
            );
        }
        return <span className="ms-1 small text-muted opacity-50">⇅</span>;
    };

    function parseBoardTitle(rawTitle: string = '') {
        const sizeMatch = rawTitle.match(/(\d+(?:[.,]\d+)?)-(\d+)-(\d+)$/);
        const sizeStr = sizeMatch ? sizeMatch[0] : '';
        const formattedDimensions = sizeMatch
            ? `${sizeMatch[1]} × ${sizeMatch[2]} × ${sizeMatch[3]} мм`
            : '';

        const withoutSize = sizeStr
            ? rawTitle.slice(0, -sizeStr.length).trim()
            : rawTitle.trim();

        const typeIndex = withoutSize.indexOf('тип');
        let brand = withoutSize;
        let type = '';

        if (typeIndex !== -1) {
            brand = withoutSize.substring(0, typeIndex).trim();
            type = withoutSize.substring(typeIndex).trim();
        }

        return {
            brand: brand || rawTitle,
            type,
            dimensions: formattedDimensions,
        };
    }

    return (
        /* px-3 задает внутренние отступы справа и слева относительно родителя, overflow-hidden убирает скролл */
        <div className="table-responsive px-2 pb-2 w-100">
            <table className="table table-hover align-middle mb-0 w-100" style={{ tableLayout: 'fixed' }}>
                <thead className="table-light border-bottom border-light-subtle">
                    <tr>
                        {/* 1. Задаем четкую пропорцию ширины вместо 1% */}
                        <th
                            className="ps-2 py-2 text-start user-select-none border-0"
                            style={{ cursor: 'pointer', width: '62%' }}
                            onClick={() => handleSort('boardTitle')}
                        >
                            <span
                                className="d-inline-flex align-items-center gap-1 text-secondary text-uppercase fw-semibold"
                                style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}
                            >
                                Наименование ГСП
                                <span className="text-muted opacity-75">{SortIcon({ columnName: 'boardTitle' })}</span>
                            </span>
                        </th>
                        <th
                            className="pe-2 py-2 text-end user-select-none border-0"
                            style={{ cursor: 'pointer', width: '38%' }}
                            onClick={() => handleSort('factValue')}
                        >
                            <span
                                className="d-inline-flex align-items-center justify-content-end gap-1 text-secondary text-uppercase fw-semibold w-100 text-nowrap"
                                style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}
                            >
                                Факт, м²
                                <span className="text-muted opacity-75">{SortIcon({ columnName: 'factValue' })}</span>
                            </span>
                        </th>
                    </tr>
                </thead>

                <tbody className="border-top-0">
                    {sortedData.length > 0 ? (
                        sortedData.map((item, index) => {
                            const { brand, type, dimensions } = parseBoardTitle(item.boardTitle);

                            return (
                                <tr key={index}>
                                    <td className="ps-2 py-2">
    {/* Верхняя строка */}
    <div
        className="fw-semibold text-dark mb-1 text-truncate"
        style={{
            fontSize: '0.88rem',
            lineHeight: 1.2
        }}
        title={`${brand} ${type}`}
    >
        {brand} {type}
    </div>

    {/* Нижняя строка */}
    {dimensions && (
        <span
            className="text-secondary fw-medium font-monospace text-nowrap bg-body-tertiary px-1 py-0 rounded border border-light-subtle text-center"
            style={{
                display: 'inline-block',
                fontSize: '0.72rem',
                letterSpacing: '-0.02em',
                minWidth: '135px',
                lineHeight: 1.2
            }}
        >
            {dimensions.replace(/\s*×\s*/g, '×')}
        </span>
    )}
</td>

                                    {/* white-space: nowrap гарантирует, что число никогда не разобьется на 3 строки */}
                                    <td className="pe-2 py-2 text-end" style={{ whiteSpace: 'nowrap' }}>
                                        <span className="fw-bold font-monospace text-dark" style={{ fontSize: '0.95rem' }}>
                                            {Number(item.factValue || 0).toLocaleString('ru-RU', {
                                                minimumFractionDigits: Number(item.factValue) % 1 !== 0 ? 2 : 0,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={2} className="text-center py-4 text-muted small">
                                Нет данных по выпуску
                            </td>
                        </tr>
                    )}
                </tbody>

                {sortedData.length > 0 && (
                    <tfoot className="border-top border-2 bg-light-subtle">
                        <tr>
                            <td className="ps-2 py-2 text-start fw-bold text-dark" style={{ fontSize: '0.88rem' }}>
                                Итого
                            </td>
                            <td className="pe-2 py-2 text-end" style={{ whiteSpace: 'nowrap' }}>
                                <span className="fw-bold text-primary font-monospace" style={{ fontSize: '1rem' }}>
                                    {totalFact.toLocaleString('ru-RU', {
                                        minimumFractionDigits: totalFact % 1 !== 0 ? 2 : 0,
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                                <span className="text-secondary small ms-1">м²</span>
                            </td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
};

export default GypsumBoardFactTable;