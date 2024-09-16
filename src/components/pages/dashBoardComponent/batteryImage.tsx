import React from "react";
import battery from './images/battery_outline_in_a_circle_blhptsyz0g2b.svg'; // Импорт изображения


const BatteryImage = () => (
    <pattern id="bgImage" patternUnits="userSpaceOnUse" width="100%" height="100%">
        <image href={battery} x="0" y="0" width="100%" height="100%" />
    </pattern>
);
export default BatteryImage;