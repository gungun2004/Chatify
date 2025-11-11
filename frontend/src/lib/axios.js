import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"                     // local backend
      : "https://chatify-1-aq3z.onrender.com/api",    // deployed backend
  withCredentials: true,  // send cookies for auth
});
