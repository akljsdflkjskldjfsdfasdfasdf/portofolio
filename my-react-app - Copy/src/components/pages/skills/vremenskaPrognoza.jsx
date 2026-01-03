import { useState, useEffect, useRef } from "react";
import useWeather from "../../hooks/useWeather";
import gsap from "gsap";
import { useColorMode } from "@chakra-ui/react";

const VremenskaPrognoza = () => {
  const { colorMode } = useColorMode();
  const [city, setCity] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Bottom of page reference
  const bottomRef = useRef(null);

  const { data, loading, error, fetchWeather } = useWeather(
    "50f1160fd8da4cfc905133600252112"
  );

  const isDark = colorMode === "dark";
  const cardBg = isDark ? "!bg-white/10" : "!bg-black/10";
  const textColor = isDark ? "text-blue-400" : "text-blue-400";
  const subTextColor = isDark ? "text-white" : "text-black-600";
  const inputBg = isDark ? "!bg-white/10" : "!bg-black/5";

  useEffect(() => {
    setSelectedIndex(0);
  }, [data?.location?.name]);

  useEffect(() => {
    if (data) {
      gsap.fromTo(
        ".main-weather-card",
        { opacity: 0, scale: 0.7, y: 110 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", y: 0 }
      );

      // Auto-scroll to bottom
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [data, selectedIndex]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) fetchWeather(city);
  };

  const selectedDay = data?.forecast?.forecastday[selectedIndex];

  return (
    <div
      className={`min-h-screen pt-32 pb-10 px-0 font-sans transition-colors duration-300`}
    >
      <div className="w-3/4 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="mb-10 flex gap-4 h-10">
          <input
            type="text"
            placeholder="Search a city..."
            className={`font-bold focus:ring-1 focus:ring-blue-500 w-2xl px-0 py-4 text-center rounded-3xl backdrop-blur-xl border border-white/20 ${textColor} ${inputBg} outline-none ring-indigo-400 transition-all shadow-lg`}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            type="submit"
            className={`w-2xs rounded-3xl !font-black !uppercase tracking-wider ${inputBg} hover:opacity-70 transition-all active:scale-80 shadow-xl `}
          >
            SEARCH
          </button>
        </form>

        {error && (
          <div className="bg-red-400/20 backdrop-blur-md border border-red-400/85 p-4 rounded-2xl text-red-500 text-center mb-6 font-bold">
            {error}
          </div>
        )}
        <div ref={bottomRef} className="absolute top-0" />
        {data && selectedDay && (
          <div className="space-y-6">
            <div
              className={`main-weather-card w-full h-auto ${cardBg} backdrop-blur-2xl border border-white/20 rounded-[40px] p-10 ${textColor} shadow-blue-400 shadow-2xs transition-all`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-5xl font-black tracking-tighter">
                    {data.location.name}
                  </h1>
                  <p
                    className={`${subTextColor} text-lg opacity-80 uppercase tracking-widest font-bold mt-1`}
                  >
                    {selectedIndex === 0
                      ? "Today"
                      : new Date(selectedDay.date).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                  </p>
                </div>
                <div>
                  <img
                    src={selectedDay.day.condition.icon}
                    alt="icon"
                    className="w-20 h-20 drop-shadow-lg mx-auto"
                  />
                  <p
                    className={`font-medium uppercase tracking-widest text-sm ${
                      isDark ? "text-blue-100" : "text-gray-600"
                    }`}
                  >
                    {selectedDay.day.condition.text}
                  </p>
                </div>
              </div>
              <div className="my-10">
                <span className="text-9xl font-thin tracking-tighter leading-none">
                  {Math.round(selectedDay.day.avgtemp_c)}°
                </span>
              </div>
              <div
                className={`grid grid-cols-3 gap-6 border-t ${
                  isDark ? "border-white/10" : "border-black/10"
                } pt-8`}
              >
                <div className="text-center">
                  <p
                    className={`text-[10px] ${subTextColor} uppercase font-bold tracking-widest mb-1`}
                  >
                    Humidity
                  </p>
                  <p className="text-2xl font-light">
                    {selectedDay.day.avghumidity}%
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className={`text-[10px] ${subTextColor} uppercase font-bold tracking-widest mb-1`}
                  >
                    Max Wind
                  </p>
                  <p className="text-2xl font-light">
                    {Math.round(selectedDay.day.maxwind_kph)} km/h
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className={`text-[10px] ${subTextColor} uppercase font-bold tracking-widest mb-1`}
                  >
                    UV Index
                  </p>
                  <p className="text-2xl font-light">{selectedDay.day.uv}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 w-4/5 gap-4 m-auto">
              {data.forecast.forecastday.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`backdrop-blur-lg border rounded-3xl ${cardBg} shadow-md shadow-blue-500 text-center transition-all cursor-pointer ${
                    selectedIndex === index
                      ? "scale-105 shadow-xl opacity-100"
                      : "opacity-70"
                  }`}
                >
                  <p className="text-[10px] uppercase font-bold mb-2">
                    {index === 0
                      ? "Today"
                      : new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                  </p>
                  <img
                    src={day.day.condition.icon}
                    alt="icon"
                    className="w-10 h-10 mx-auto"
                  />
                  <p className="text-xl font-bold mt-2">
                    {Math.round(day.day.avgtemp_c)}°
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VremenskaPrognoza;
