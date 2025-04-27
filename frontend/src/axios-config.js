import axios from 'axios'

// Create an instance of axios with default settings
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_URL_BACKEND,
})

// Function to decode JWT without extra dependencies
const decodeToken = (token) => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Token does not have valid JWT structure')
      return null
    }
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

// Function to validate token format and expiration
export const validateToken = (token) => {
  if (!token || typeof token !== 'string') {
    console.error('Token is missing or not a string')
    return { valid: false, message: 'Token is missing or invalid format' }
  }

  // Check token format (Bearer token)
  if (!token.startsWith('Bearer ') && token.split('.').length !== 3) {
    console.error('Token does not have valid JWT format')
    return { valid: false, message: 'Invalid token format' }
  }

  // If token includes "Bearer ", remove it for validation
  const jwtToken = token.startsWith('Bearer ') ? token.substring(7) : token
  
  // Decode and validate
  const decoded = decodeToken(jwtToken)
  if (!decoded) {
    return { valid: false, message: 'Could not decode token' }
  }

  // Check expiration
  const currentTime = Math.floor(Date.now() / 1000)
  if (decoded.exp && decoded.exp < currentTime) {
    console.error('Token has expired', { 
      expiration: new Date(decoded.exp * 1000).toISOString(),
      current: new Date().toISOString()
    })
    return { valid: false, message: 'Token has expired', decoded }
  }

  return { valid: true, message: 'Token is valid', decoded }
}

// Function to attempt to refresh the token
const refreshAuthToken = async () => {
  try {
    // This would need to be implemented according to your backend refresh token endpoint
    // For now, this is just a placeholder implementation
    const response = await axios.post(
      `${import.meta.env.VITE_URL_BACKEND}/auth/refresh`, 
      {}, 
      { 
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        } 
      }
    )
    
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token)
      return true
    }
    return false
  } catch (error) {
    console.error('Failed to refresh token:', error)
    // If refresh fails, redirect to login
    window.location.href = '/'
    return false
  }
}

// Request interceptor to add a token to the request headers with validation
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Retrieve token from storage
    console.log('[Axios] token',token);
    
    if (token) {
      // Validate token before adding to headers
      const { valid, message, decoded } = validateToken(token)
      
      if (!valid) {
        console.error(`Token validation failed: ${message}`, decoded)
        
        // If token is expired, we could try to refresh here
        // For now, just log the error and continue with the invalid token
        // The response interceptor will handle the 401 error
      }
      
      // Add token to headers regardless (server will validate)
      config.headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor to handle token errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If unauthorized error (401) and not already retrying
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      console.error('Received 401 Unauthorized error:', error.response.data)
      
      // Check if it's an invalid token error
      if (error.response.data && error.response.data.message === 'Invalid token') {
        console.log('Attempting to refresh token...')
        
        // Try to refresh the token
        const refreshSuccess = await refreshAuthToken()
        
        if (refreshSuccess) {
          // Update token in the original request
          const newToken = localStorage.getItem('token')
          console.log('[Ax1os] token',newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
          
          // Retry the original request
          return apiClient(originalRequest)
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
