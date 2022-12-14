import axios from "axios";

const api = axios.create({
  withCredentials: true
});

const configureToken = (token) => {
  const bearer = `Bearer ${token}`
  api.defaults.headers.Authorization = bearer
}

export {
  api,
  configureToken
};
