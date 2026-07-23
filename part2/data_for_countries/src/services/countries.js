import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const get = (name) => {
  const request = axios.get(`${baseUrl}/name/${name}`);
  return request.then((response) => {
    return response.data;
  });
};
const getAll = () => {
  const request = axios.get(`${baseUrl}/all`);
  return request.then((response) => {
    return response.data;
  });
};

export default { get, getAll };
