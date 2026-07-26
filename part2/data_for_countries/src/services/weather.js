import axios from "axios";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

const get = (capital, apiKey) => {
  const request = axios.get(
    `${baseUrl}${capital}&appid=${apiKey}&units=metric`,
  );
  return request.then((response) => {
    return response.data;
  });
};

export default { get };
