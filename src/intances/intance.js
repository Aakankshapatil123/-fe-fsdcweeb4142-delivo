import axios from "axios";

 

const intance = axios.create({
    baseURL: "http://localhost:3001/api/v1",
    timeout:10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default intance;