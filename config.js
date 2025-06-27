// config.js - Shared configuration
window.AppConfig = (function () {
    const getApiConfig = () => {
        const hostname = window.location.hostname;
        const isProduction = hostname === 'rocal93.github.io' || hostname.includes('github.io');

        return {
            API_URL: isProduction
                ? 'https://sophiebluel-production-c545.up.railway.app/api'
                : 'http://localhost:5678/api',
            API_BASE_URL: isProduction
                ? 'https://sophiebluel-production-c545.up.railway.app'
                : 'http://localhost:5678'
        };
    };

    const config = getApiConfig();

    // Helper function to correct image URLs
    const correctImageUrl = (imageUrl) => {
        if (!imageUrl) return '';

        if (window.location.hostname === 'rocal93.github.io' || window.location.hostname.includes('github.io')) {
            return imageUrl.replace('http://localhost:5678', config.API_BASE_URL);
        }

        if (imageUrl.startsWith('http://') && !imageUrl.includes('localhost')) {
            return imageUrl.replace('http://', 'https://');
        }

        return imageUrl;
    };

    return {
        API_URL: config.API_URL,
        API_BASE_URL: config.API_BASE_URL,
        correctImageUrl: correctImageUrl
    };
})();

console.log('🔧 Config loaded - API URL:', window.AppConfig.API_URL);