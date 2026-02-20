import { formatDistanceToNow } from 'date-fns';
// Format date
export const formatDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};
// Format date and time
export const formatDateTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};
// Format time
export const formatTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};
// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
};
// Calculate AQI from PM2.5 (US EPA method)
export const calculateAQI = (pm25) => {
    let aqi = 0;
    let level = 'Good';
    if (pm25 <= 12) {
        aqi = (pm25 / 12) * 50;
        level = 'Good';
    }
    else if (pm25 <= 35.4) {
        aqi = ((pm25 - 12) / (35.4 - 12)) * 50 + 50;
        level = 'Moderate';
    }
    else if (pm25 <= 55.4) {
        aqi = ((pm25 - 35.4) / (55.4 - 35.4)) * 50 + 100;
        level = 'Unhealthy for Sensitive Groups';
    }
    else if (pm25 <= 150.4) {
        aqi = ((pm25 - 55.4) / (150.4 - 55.4)) * 50 + 150;
        level = 'Unhealthy';
    }
    else if (pm25 <= 250.4) {
        aqi = ((pm25 - 150.4) / (250.4 - 150.4)) * 50 + 200;
        level = 'Very Unhealthy';
    }
    else {
        aqi = ((pm25 - 250.4) / (500 - 250.4)) * 50 + 250;
        level = 'Hazardous';
    }
    return {
        aqi: Math.round(aqi),
        level,
    };
};
// Get AQI color
export const getAQIColor = (aqi) => {
    if (aqi <= 50)
        return '#10b981'; // Green
    if (aqi <= 100)
        return '#f59e0b'; // Yellow
    if (aqi <= 150)
        return '#f97316'; // Orange
    if (aqi <= 200)
        return '#ef4444'; // Red
    if (aqi <= 300)
        return '#9333ea'; // Purple
    return '#6b21a8'; // Maroon
};
// Get AQI status description
export const getAQIDescription = (aqi) => {
    if (aqi <= 50)
        return { status: 'Good', description: 'Air quality is satisfactory' };
    if (aqi <= 100)
        return { status: 'Moderate', description: 'Acceptable air quality' };
    if (aqi <= 150)
        return {
            status: 'Unhealthy for Sensitive Groups',
            description: 'Members of sensitive groups may experience problems',
        };
    if (aqi <= 200)
        return {
            status: 'Unhealthy',
            description: 'Some members of the general public may experience problems',
        };
    if (aqi <= 300)
        return {
            status: 'Very Unhealthy',
            description: 'Health warnings of emergency conditions',
        };
    return {
        status: 'Hazardous',
        description: 'Health alert - everyone should avoid outdoor exertion',
    };
};
// Generate health recommendations based on AQI
export const generateHealthRecommendations = (aqi) => {
    const recommendations = [];
    if (aqi <= 50) {
        recommendations.push('Air quality is good. Feel free to enjoy outdoor activities.');
    }
    else if (aqi <= 100) {
        recommendations.push('Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor exertion.');
    }
    else if (aqi <= 150) {
        recommendations.push('Members of sensitive groups should limit outdoor exertion.');
        recommendations.push('Consider wearing an N95 mask if going outside.');
    }
    else if (aqi <= 200) {
        recommendations.push('Limit outdoor activity. Wear a mask if going outside.');
        recommendations.push('Consider staying indoors or using air purifiers.');
    }
    else if (aqi <= 300) {
        recommendations.push('Stay indoors and use air purifiers.');
        recommendations.push('Only go outside with proper respiratory protection.');
    }
    else {
        recommendations.push('Avoid all outdoor activity.');
        recommendations.push('Use air purifiers and keep windows closed.');
    }
    return recommendations;
};
// Parse error message
export const parseErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unknown error occurred';
};
// Truncate text
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength) + '...';
};
// Format number with comma separator
export const formatNumber = (num, decimals = 2) => {
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};
// Delay execution
export const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
// Check if value is empty
export const isEmpty = (value) => {
    return (value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && Object.keys(value).length === 0));
};
// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
// Validate strong password
export const isStrongPassword = (password) => {
    return (password.length >= 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*]/.test(password));
};
// Deep clone object
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
// Merge objects
export const mergeObjects = (...objects) => {
    return objects.reduce((acc, obj) => ({ ...acc, ...obj }), {});
};
// Sort array by property
export const sortByProperty = (arr, property, order = 'asc') => {
    return [...arr].sort((a, b) => {
        const aVal = a[property];
        const bVal = b[property];
        if (aVal < bVal)
            return order === 'asc' ? -1 : 1;
        if (aVal > bVal)
            return order === 'asc' ? 1 : -1;
        return 0;
    });
};
// Filter array by multiple conditions
export const filterByConditions = (arr, conditions) => {
    return arr.filter((item) => {
        return Object.entries(conditions).every(([key, value]) => {
            return item[key] === value;
        });
    });
};
