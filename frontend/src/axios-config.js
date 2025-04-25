import axios from 'axios'

// Create an instance of axios with default settings
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_URL_BACKEND,
})

// Request interceptor to add a token to the request headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Retrieve token from storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default apiClient
