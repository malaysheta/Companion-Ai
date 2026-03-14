const BASE_URL = import.meta.env.DEV ? '/api' : 'https://companion-ai-6wcl.onrender.com';

// Helper for handling fetch responses
const handleResponse = async (response, endpoint = '') => {
    if (!response.ok) {
        if (response.status === 401 && endpoint !== '/login' && endpoint !== '/create_user') {
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
                window.dispatchEvent(new Event('auth:unauthorized'));
            }
        }
        let errorData = {};
        try {
            errorData = await response.json();
        } catch (e) { }

        // Check if error is wrapped in ApiResponse
        const message = errorData.message || errorData.detail?.[0]?.msg || errorData.detail || response.statusText;
        const error = new Error(message);
        error.status = response.status;
        error.data = errorData;
        throw error;
    }
    const json = await response.json();
    // Backend often wraps success responses in { success: true, data: ..., message: ... }
    if (json && typeof json === 'object' && json.success === true && 'data' in json) {
        // For user_data, the backend returns a stringified python list that's mostly invalid JSON
        if (typeof json.data === 'string' && json.data.startsWith('[')) {
            try {
                // Python string representation lists use single quotes instead of double quotes
                // we're bypassing user_data entirely so we can just return it
                return json.data;
            } catch (e) { }
        }
        return json.data;
    }
    return json;
};

// Add token to headers if available
const getHeaders = (options = {}) => {
    const headers = new Headers(options.headers || {});
    // Assuming token might be stored in localStorage
    const token = localStorage.getItem('token');
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }
    return headers;
};

// Base fetch wrapper
const apiClient = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const headers = getHeaders(options);

    const config = {
        ...options,
        headers,
    };

    // If body is an object and not FormData, stringify it
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData) && !(config.body instanceof URLSearchParams)) {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(url, config);
        return await handleResponse(response, endpoint);
    } catch (error) {
        console.error(`API Error on ${endpoint}:`, error);
        throw error;
    }
};

export const apiService = {
    // User Authentication
    login: (username, password) => {
        // Backend expects application/x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        return apiClient('/login', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    },

    register: (userData) => {
        return apiClient('/create_user', {
            method: 'POST',
            body: userData // expects { username, email, password }
        });
    },

    getUserData: () => {
        return apiClient('/user_data', {
            method: 'GET'
        });
    },

    // Manuals
    getUsersManual: () => {
        return apiClient('/users_manual', {
            method: 'GET'
        });
    },

    getAdminsManual: () => {
        return apiClient('/admins_manulas', {
            method: 'GET' // Typo in backend routeadmins_manulas => admins_manulas
        });
    },

    deleteManual: (companyName, productName) => {
        return apiClient(`/manual/${encodeURIComponent(companyName)}/${encodeURIComponent(productName)}`, {
            method: 'DELETE'
        });
    },

    uploadFile: (companyName, productName, productCode, file) => {
        const formData = new FormData();
        formData.append('company_name', companyName);
        formData.append('product_name', productName);
        formData.append('product_code', productCode);
        formData.append('file', file);

        return apiClient('/upload_file', {
            method: 'POST',
            body: formData
        });
    },

    manualQuery: (companyName, productName, productCode, query, topK = 5) => {
        return apiClient('/manual_query', {
            method: 'POST',
            body: {
                company_name: companyName,
                product_name: productName,
                product_code: productCode,
                query: query,
                top_k: topK
            }
        });
    },

    // Misc
    getRoot: () => {
        return apiClient('/', {
            method: 'GET'
        });
    },

    getHealth: () => {
        return apiClient('/health', {
            method: 'GET'
        });
    }
};
