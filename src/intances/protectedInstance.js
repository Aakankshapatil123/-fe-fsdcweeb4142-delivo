import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const protectedIntance = axios.create({
    baseURL: baseURL,
    timeout:10000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true //include cookies in requests
});

export default protectedIntance;