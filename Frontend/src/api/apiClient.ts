const API_BASE_URL = "http://localhost:8081/api";

export async function apiGet<T>(path: string): Promise<T> {
  try {
    console.log(`Making GET request to: ${API_BASE_URL}${path}`);
    const response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Response status for ${path}:`, response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response from ${path}:`, errorText);
      throw new Error(`GET ${path} failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Response data from ${path}:`, data);
    return data;
  } catch (error) {
    console.error(`Error in apiGet ${path}:`, error);
    throw error;
  }
}

export async function apiPost<T, B = unknown>(path: string, body: B): Promise<T> {
  try {
    console.log(`Making POST request to: ${API_BASE_URL}${path}`);
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log(`Response status for POST ${path}:`, response.status);
    
    // Clone the response to read it multiple times if needed
    const responseClone = response.clone();
    
    // First, try to parse as JSON for successful responses
    if (response.ok) {
      try {
        const data = await response.json();
        console.log('Response data:', data);
        return data;
      } catch (e) {
        console.error('Failed to parse successful response as JSON:', e);
        // If parsing as JSON fails, try to read as text
        const text = await response.text();
        console.log('Response text:', text);
        return text as any;
      }
    }
    
    // For error responses, try to get error details
    let errorDetails = 'No error details available';
    try {
      // Try to get the error from the cloned response
      const errorResponse = await responseClone.json();
      errorDetails = JSON.stringify(errorResponse, null, 2);
      console.log('Error response body:', errorDetails);
    } catch (e) {
      try {
        // If JSON parsing fails, try to read as text
        const textResponse = await response.text();
        errorDetails = textResponse || 'No error details available';
        console.log('Error response text:', errorDetails);
      } catch (textError) {
        console.error('Failed to read error response:', textError);
      }
    }
    
    throw new Error(`POST ${path} failed with status ${response.status}: ${errorDetails}`);
  } catch (error) {
    console.error(`Error in apiPost ${path}:`, error);
    throw error;
  }
}

export async function apiPut<T, B = unknown>(path: string, body: B): Promise<T> {
  try {
    console.log(`Making PUT request to: ${API_BASE_URL}${path}`);
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log(`Response status for PUT ${path}:`, response.status);
    
    // Clone the response to read it multiple times if needed
    const responseClone = response.clone();
    
    // First, try to parse as JSON for successful responses
    if (response.ok) {
      try {
        const data = await response.json();
        console.log('Response data:', data);
        return data;
      } catch (e) {
        console.error('Failed to parse successful response as JSON:', e);
        // If parsing as JSON fails, try to read as text
        const text = await response.text();
        console.log('Response text:', text);
        return text as any;
      }
    }
    
    // For error responses, try to get error details
    let errorDetails = 'No error details available';
    try {
      // Try to get the error from the cloned response
      const errorResponse = await responseClone.json();
      errorDetails = JSON.stringify(errorResponse, null, 2);
      console.log('Error response body:', errorDetails);
    } catch (e) {
      try {
        // If JSON parsing fails, try to read as text
        const textResponse = await response.text();
        errorDetails = textResponse || 'No error details available';
        console.log('Error response text:', errorDetails);
      } catch (textError) {
        console.error('Failed to read error response:', textError);
      }
    }
    
    throw new Error(`PUT ${path} failed with status ${response.status}: ${errorDetails}`);
  } catch (error) {
    console.error(`Error in apiPut ${path}:`, error);
    throw error;
  }
}

export async function apiDelete(path: string): Promise<void> {
  try {
    console.log(`Making DELETE request to: ${API_BASE_URL}${path}`);
    
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Response status for DELETE ${path}:`, response.status);
    
    // For 204 No Content or 404 Not Found, we don't need to parse the response
    if (response.status === 204 || response.status === 404) {
      return;
    }
    
    // For other error status codes, try to get error details
    if (!response.ok) {
      // Clone the response to read it multiple times if needed
      const responseClone = response.clone();
      
      let errorDetails = 'No error details available';
      try {
        // Try to get the error from the response as JSON
        const errorResponse = await responseClone.json();
        errorDetails = JSON.stringify(errorResponse, null, 2);
        console.log('Error response body:', errorDetails);
      } catch (e) {
        try {
          // If JSON parsing fails, try to read as text
          const textResponse = await response.text();
          errorDetails = textResponse || 'No error details available';
          console.log('Error response text:', errorDetails);
        } catch (textError) {
          console.error('Failed to read error response:', textError);
        }
      }
      
      throw new Error(`DELETE ${path} failed with status ${response.status}: ${errorDetails}`);
    }
    
    // For successful responses other than 204/404, try to parse as JSON
    try {
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (e) {
      console.error('Failed to parse successful response as JSON:', e);
      // If parsing as JSON fails, try to read as text
      const text = await response.text();
      console.log('Response text:', text);
      return text as any;
    }
  } catch (error) {
    console.error(`Error in apiDelete ${path}:`, error);
    throw error;
  }
}
