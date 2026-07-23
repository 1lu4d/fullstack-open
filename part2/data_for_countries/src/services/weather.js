import axios from "axios";
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

const get = (city) => {
  const request = axios.get(`${baseUrl}${city}&appid=${apiKey}&units=metric`);
  return request.then((response) => {
    return response.data;
  });
};

export default { get };
