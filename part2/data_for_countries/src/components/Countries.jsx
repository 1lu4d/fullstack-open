import Note from "./Note";
const Countries = ({
  countriesToShow,
  handleShow,
  selectedCountry,
  weather,
}) => {
  console.log("countriesToShow ", countriesToShow);

  if (!countriesToShow) return;
  if (countriesToShow.length >= 10) {
    return (
      <div>
        <p>Too many mathes, specify another filter</p>
      </div>
    );
  } else if (!selectedCountry) {
    return (
      <ul>
        {countriesToShow.map((country) => (
          <Note
            key={country.cca3}
            note={country.name.common}
            country={country}
            handleShow={handleShow}
          />
        ))}
      </ul>
    );
  }
  const countryToShow = selectedCountry;
  return (
    <div>
      <h1>{countryToShow.name.common}</h1>
      <p>Capital {countryToShow.capital}</p>
      <p>Area {countryToShow.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(countryToShow.languages).map((language) => (
          <Note key={language} note={language} />
        ))}
      </ul>
      <img
        src={countryToShow.flags.png}
        alt={`Flag of ${countryToShow.name.common}`}
        style={{ width: "150px" }}
      />
      {weather ? (
        <>
          <h2>Weather in {countryToShow.capital}</h2>
          <p>Temperature {weather.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={`Weather representation in ${countriesToShow.capital}`}
            style={{ width: "150px" }}
          />
        </>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
};
export default Countries;
