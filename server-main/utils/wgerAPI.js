const axios = require('axios');
const NodeCache = require('node-cache');

// Import mock data if needed
try {
  const { getMockDataForEndpoint } = require('./mockData');
  var mockDataAvailable = true;
} catch (err) {
  var mockDataAvailable = false;
}

// Cache setup for API responses (TTL: 1 hour)
const cache = new NodeCache({ stdTTL: 3600 });

// Changed to use the correct API endpoint
const WGER_API_BASE_URL = 'https://wger.de/api/v2';

// Should we use mock data when API calls fail?
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development';

// Adding a timeout to avoid hanging requests
const TIMEOUT_MS = 10000;

// Helper for making authenticated requests to WGER API
const wgerAPI = {
  // Get API token
  getToken: async (username, password) => {
    try {
      const response = await axios.post(`${WGER_API_BASE_URL}/token-auth/`, {
        username,
        password
      }, {
        timeout: TIMEOUT_MS
      });
      return response.data.token;
    } catch (error) {
      console.error('Error getting WGER token:', error.message);
      throw new Error('Failed to authenticate with WGER');
    }
  },

  // Request function with improved error handling and language parameter fixes
  //TODO(username and password to be same as wger or token to be added here)
  request: async (endpoint, method = 'GET', data = null, token = null) => {
    // Clone the data to avoid modifying the original
    let requestData = data ? { ...data } : {};
    
    // Fix for the language parameter issue
    // If this is the exercise endpoint, change 'en' to 2 (the actual ID for English)
    if (endpoint.startsWith('exercise') && requestData.language === 'en') {
      requestData.language = 2;
    }
    
    const cacheKey = `wger_${endpoint}_${method}_${JSON.stringify(requestData)}`;
    console.log('WGER API Request:', {
      endpoint,
      method,
      data: requestData,
      cacheKey
    });
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached data for:', cacheKey);
      return cachedData;
    }
    
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }
      
      const config = {
        method,
        url: `${WGER_API_BASE_URL}/${endpoint}`,
        headers,
        data: method !== 'GET' ? requestData : undefined,
        params: method === 'GET' ? requestData : undefined,
        timeout: TIMEOUT_MS,
        validateStatus: (status) => status < 500 // Don't reject on 4xx errors
      };
      
      console.log('Making API request with config:', {
        url: config.url,
        method: config.method,
        params: config.params,
        headers: config.headers
      });
      
      const response = await axios(config);
      
      // Check for API error responses
      if (response.status >= 400) {
        console.error('WGER API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        });
        throw new Error(`WGER API returned status ${response.status}: ${JSON.stringify(response.data)}`);
      }
      
      console.log('API response received:', {
        status: response.status,
        dataLength: response.data ? Object.keys(response.data).length : 0
      });
      
      // Store in cache
      cache.set(cacheKey, response.data);
      
      return response.data;
    } catch (error) {
      // Provide more detailed error logging
      console.error('WGER API Error:', {
        endpoint,
        method,
        error: {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          stack: error.stack
        }
      });
      
      // If we have mocked data for development or if configured to use mock data, return it
      if (USE_MOCK_DATA && mockDataAvailable) {
        const mockData = getMockDataForEndpoint(endpoint);
        if (mockData) {
          console.log('Returning mock data due to API failure');
          
          // Also cache the mock data
          cache.set(cacheKey, mockData);
          
          return mockData;
        }
      }
      
      throw new Error(`WGER API request failed: ${error.message}`);
    }
  },
  
  // Utility method to check if the API is accessible
  checkApiStatus: async () => {
    try {
      const response = await axios.get(`${WGER_API_BASE_URL}/info`, {
        timeout: 5000
      });
      return {
        status: 'ok',
        apiVersion: response.data.api_version || 'unknown',
        message: 'WGER API is accessible'
      };
    } catch (error) {
      console.error('API Status Check Error:', error.message);
      return {
        status: 'error',
        message: `WGER API is not accessible: ${error.message}`,
        error: error
      };
    }
  }
};

module.exports = wgerAPI;