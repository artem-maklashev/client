import { DrywallItem } from "../../models/DrywallItem";

export interface ProductionCell {
    item: DrywallItem | null;
    duration: number;
}

export class ProductionPlan {
    private items: DrywallItem[];
    private stepHours: number;

    constructor(items: DrywallItem[], stepHours: number) {
        this.items = items;
        this.stepHours = stepHours;
    }

    private roundToHour(d: Date): Date {
        const nd = new Date(d);
        nd.setMinutes(0, 0, 0);
        return nd;
    }

    private addHours(d: Date, h: number): Date {
        const nd = new Date(d);
        nd.setHours(nd.getHours() + h);
        return nd;
    }

    private getOverlapMinutes(start: number, end: number, colStart: number, colEnd: number): number {
        const overlapStart = Math.max(start, colStart);
        const overlapEnd = Math.min(end, colEnd);
        return (overlapEnd - overlapStart) / (1000 * 60);
    }

    public getProductTypes(): string[] {
        return Array.from(new Set(this.items.map(item => item.product.toString()))).sort();
    }

    public getTimeColumns(): Date[] {
        if (this.items.length === 0) return [];

        const minStart = new Date(Math.min(...this.items.map(i => i.startProduction.getTime())));
        const maxEnd = new Date(Math.max(...this.items.map(i => i.endProduction.getTime())));
        const start = this.roundToHour(minStart);
        const end = this.roundToHour(this.addHours(maxEnd, this.stepHours));

        const columns: Date[] = [];
        let current = start;
        while (current <= end) {
            columns.push(current);
            current = this.addHours(current, this.stepHours);
        }
        return columns;
    }

    public getTableData(): { productType: string; cells: ProductionCell[] }[] {
        const productTypes = this.getProductTypes();
        const timeColumns = this.getTimeColumns();

        return productTypes.map(productType => {
            const cells: ProductionCell[] = timeColumns.map(() => ({ item: null, duration: 0 }));

            const rows = this.items.filter(item => item.product.toString() === productType);

            rows.forEach(item => {
                const start = item.startProduction.getTime();
                const end = item.endProduction.getTime();

                timeColumns.forEach((col, idx) => {
                    const colStart = col.getTime();
                    const colEnd = colStart + this.stepHours * 60 * 60 * 1000;

                    const duration = this.getOverlapMinutes(start, end, colStart, colEnd);

                    if (duration > 0) {
                        cells[idx] = { item, duration: duration };
                    }
                });
            });

            return { productType, cells };
        });
    }
}

