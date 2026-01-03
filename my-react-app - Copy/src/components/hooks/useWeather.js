import { useState, useCallback } from "react";

const useWeather = (apiKey) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(
    async (city) => {
      // Provera da li je ključ prosleđen
      if (!apiKey || apiKey === "OVDE_STAVI_KLJUC") {
        setError("Nedostaje API ključ!");
        return;
      }
      if (!city) return;

      setLoading(true);
      setError(null);

      try {
        // ISPRAVLJENO: Koristimo ${apiKey} promenljivu, bez suvišnih $ simbola
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error?.message || "Došlo je do greške");
        }

        setData(result);
        console.log(result)
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
     
    },
    [apiKey]
  );

  return { data, loading, error, fetchWeather };
};

export default useWeather;
