import React, { useEffect } from "react";

const WeatherWidget: React.FC = () => {
  useEffect(() => {
    const scriptId = "weatherwidget-script";

    // Проверяем, чтобы скрипт не добавлялся повторно
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://app3.weatherwidget.org/js/?id=ww_3ac19717ea2c4";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      id="ww_3ac19717ea2c4"
      data-v="1.3"
      data-loc="id"
      data-a='{
        "t":"ticker",
        "lang":"ru",
        "ids":[],
        "font":"Arial",
        "sl_ics":"one_a",
        "sl_sot":"celsius",
        "cl_bkg":"#455A64",
        "cl_font":"#FFFFFF",
        "cl_cloud":"#FFFFFF",
        "cl_persp":"#81D4FA",
        "cl_sun":"#FFC107",
        "cl_moon":"#FFC107",
        "cl_thund":"#FF5722"
      }'
    >
      <a
        href="https://weatherwidget.org/"
        id="ww_3ac19717ea2c4_u"
        target="_blank"
        rel="noreferrer"
      >
      </a>
    </div>
  );
};

export default WeatherWidget;