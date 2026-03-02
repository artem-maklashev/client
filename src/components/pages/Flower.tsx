import React from "react";
import "./flower.css";

const FlowerEight: React.FC = () => {
  return (
    <div
      className="eight-container"
      style={{
        position: "fixed",
        bottom: "60px",
        right: "20px",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div className="eight">

        {/* Верхний круг */}
        <div className="ring top">
          <div className="ring-scale">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`top-${i}`}
                className="petal-rotate"
                style={{ transform: `rotate(${i * 30}deg)` }}
              >
                <div className="petal" />
              </div>
            ))}
            <div className="center" />
          </div>
        </div>

        {/* Нижний круг */}
        <div className="ring bottom">
          <div className="ring-scale">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`bottom-${i}`}
                className="petal-rotate"
                style={{ transform: `rotate(${i * 30}deg)` }}
              >
                <div className="petal" />
              </div>
            ))}
            <div className="center" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default FlowerEight;