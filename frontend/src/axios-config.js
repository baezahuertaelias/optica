import axios from 'axios'

// Set the base URL for Axios
const instance = axios.create({
  baseURL: import.meta.env.VITE_URL_BACKEND, // Use environment variable for better security and flexibility
})

export default instance
