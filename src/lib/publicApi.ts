import axios from "axios";

const publicApi = axios.create({
    baseURL:"http://localhost:5000",
    withCredentials:false // No credentials for public access
})

export default publicApi;
