import axios from "axios";

const baseURL = 'http://localhost:3001/api/v1';

const protectedIntance = axios.create({
    baseURL: baseURL,
    timeout:10000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true //include cookies in requests
});

export default protectedIntance;