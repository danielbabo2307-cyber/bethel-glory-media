import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  // On ne met plus Content-Type ici
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Si c'est un FormData (upload de photo),
    // on laisse le navigateur gérer le Content-Type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      // Pour les requêtes normales (JSON)
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;