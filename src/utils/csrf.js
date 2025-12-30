/**
 * Utility functions for CSRF token handling.
 *
 * CSRF (Cross-Site Request Forgery) protection prevents malicious websites
 * from making unauthorized requests to our API on behalf of users.
 *
 * The CSRF token is provided by the backend in a meta tag and must be
 * included in the X-CSRFToken header for all POST/PUT/DELETE requests.
 */

/**
 * Gets the CSRF token from the page's meta tag.
 *
 * The backend sets a meta tag like:
 * <meta name="csrf-token" content="TOKEN_VALUE">
 *
 * This token must be included in the X-CSRFToken header for all
 * state-changing requests (POST, PUT, PATCH, DELETE).
 *
 * @returns {string|null} The CSRF token, or null if not found
 * @throws {Error} If CSRF token meta tag is not found (in production)
 *
 * @example
 * const csrfToken = getCsrfToken();
 * axios.post('/api/suggest-new-point', data, {
 *   headers: { 'X-CSRFToken': csrfToken }
 * });
 */
export const getCsrfToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');

    if (!metaTag) {
        console.error('CSRF token meta tag not found in page HTML');
        throw new Error(
            'CSRF token not found. Please ensure the backend includes ' +
                '<meta name="csrf-token" content="..."> in the page HTML.',
        );
    }

    const token = metaTag.getAttribute('content');

    if (!token) {
        console.error('CSRF token meta tag found but content is empty');
        throw new Error('CSRF token is empty');
    }

    return token;
};

/**
 * Creates axios headers object with CSRF token.
 *
 * Convenience function to generate headers with CSRF token
 * for use with axios requests.
 *
 * @param {Object} additionalHeaders - Optional additional headers to merge
 * @returns {Object} Headers object with X-CSRFToken
 *
 * @example
 * axios.post('/api/suggest-new-point', data, {
 *   headers: getCsrfHeaders({ 'Content-Type': 'application/json' })
 * });
 */
export const getCsrfHeaders = (additionalHeaders = {}) => {
    return {
        'X-CSRFToken': getCsrfToken(),
        ...additionalHeaders,
    };
};
