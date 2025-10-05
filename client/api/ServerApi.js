import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const serverApi = axios.create({
    baseURL:SERVER_URL,
    withCredentials:true
})

export default serverApi;