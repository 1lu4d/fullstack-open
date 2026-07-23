import Filter from "./components/Filter";
import Countries from "./components/Countries";
import countryService from "./services/countries";
import weatherService from "./services/weather";
import { useState, useEffect } from "react";

const App = () => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);
  const handleFilterChange = (event) => {
    console.log("Filter field changes to ", event.target.value);
    setFilter(event.target.value);
    setSelectedCountry(null);
  };
  const countriesToShow =
    filter === ""
      ? countries
      : countries.filter((country) =>
          country.name.common.toLowerCase().includes(filter.toLowerCase()),
        );

  useEffect(() => {
    countryService
      .getAll()
      .then((initialCountries) => {
        setCountries(initialCountries);
        console.log("Loaded stuff ", initialCountries);
      })
      .catch(() => {
        console.log("Failed to fetch countries list");
      });
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;

    weatherService
      .get(selectedCountry.capital, apiKey)
      .then((weatherData) => {
        setWeather(weatherData);
      })
      .catch(() => {
        console.log("Failed to get weather data");
      });
  }, [selectedCountry, apiKey]);

  if (countries.length === 0) {
    return <div>Loading...</div>;
  }
  const handleShow = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <Filter value={filter} onChange={handleFilterChange} />
      <Countries
        selectedCountry={selectedCountry}
        countriesToShow={countriesToShow}
        handleShow={handleShow}
        weather={weather}
      />
    </div>
  );
};
export default App;
