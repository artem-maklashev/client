import { useEffect } from "react";

const WeatherWidget: React.FC = () => {
   useEffect(() => {
    const existing = document.querySelector(
      'script[src*="c7bc7c4184f26c2bdecb81022e133179"]'
    );

    if (!existing) {
      const script = document.createElement("script");
      script.src =
        "https://world-weather.ru/wwinformer.php?userid=c7bc7c4184f26c2bdecb81022e133179";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
    }

    return () => {
      const script = document.querySelector(
        'script[src*="c7bc7c4184f26c2bdecb81022e133179"]'
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <div
        id="c7bc7c4184f26c2bdecb81022e133179"
        className="ww-informers-box-854753"
      >
        <p className="ww-informers-box-854754">
          <a
            href="https://world-weather.ru/pogoda/russia/tolyatti/month/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Подробнее о погоде в Тольятти на 30 дней
          </a>
          <br />
          <a
            href="https://world-weather.ru/pogoda/russia/volgograd/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Погода в Волгограде
          </a>
        </p>
      </div>

      <style>
        {`
          .ww-informers-box-854754 {
            animation-name: ww-informers54;
            animation-duration: 1.5s;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 12px;
            font-family: Arial;
            line-height: 18px;
            text-align: center;
          }

          @keyframes ww-informers54 {
            0%, 80% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </>
  );
};
export default WeatherWidget;