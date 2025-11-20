import { ProductionCell } from "./models/ProductionPlan";

interface ProductionRowProps {
    rowData: { productType: string; cells: ProductionCell[] };
    colIndex: number;
}

const getCellColor = (duration: number) => {
  if (duration === 0) return "transparent";
  if (duration <= 180) return "var(--color-low)";
  if (duration <= 540) return "var(--color-medium)";
  return "var(--color-high)";
};

const ProductionRow: React.FC<ProductionRowProps> = ({rowData, colIndex}) => {
    
    
    const cell = rowData.cells[colIndex];

    const bg = getCellColor(cell.duration);

    return (
      <div
        style={{
          backgroundColor: cell.item?.id === 0 ? "grey" : bg,
          cursor: cell.duration > 0 ? "pointer" : "default",
          textAlign: "center",
          padding: "1px",
          fontWeight: cell.duration > 0 ? "bold" : "normal",
          color: cell.duration > 180 || cell.item?.id === 0 ? "#fff" : undefined
        }}      
      >
        {cell.duration > 0 && cell.item && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ lineHeight: "1", margin: 0, padding: 0 }}>
              {Math.round(cell.duration)}'
            </span>
            <span style={{ fontSize: "0.8em" }}>
              {cell.item?.id !== 0 && (
                <>
                  {Math.round(
                    cell.duration *
                    cell.item.product.factSpeed *
                    (Number(cell.item.product.width.value) / 1000)
                  )}{" "}
                  м².
                </>
              )}
            </span>
          </div>
        )}
      </div>
    );
  };
  export default ProductionRow;