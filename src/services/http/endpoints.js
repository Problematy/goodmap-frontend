/**
 * API endpoint for fetching all categories.
 */
export const CATEGORIES = '/api/categories';

/**
 * API endpoint for fetching subcategories for a specific category.
 * Use with category name appended: /api/category/{categoryName}
 */
export const CATEGORY = '/api/category';

/**
 * API endpoint for fetching available languages.
 */
export const LANGUAGES = '/api/languages';

/**
 * API endpoint for fetching a single location by ID.
 * Use with location UUID appended: /api/location/{uuid}
 */
export const LOCATION = '/api/location';

/**
 * API endpoint for fetching all locations.
 * Supports query parameters for filtering.
 */
export const LOCATIONS = '/api/locations';

/**
 * API endpoint for fetching server-side clustered locations.
 * Supports query parameters for filtering and map configuration (zoom, bounds).
 */
export const LOCATIONS_CLUSTERED = '/api/locations-clustered';

/**
 * External API endpoint for address search using OpenStreetMap Nominatim.
 * Supports geocoding and reverse geocoding.
 */
export const SEARCH_ADDRESS = 'https://nominatim.openstreetmap.org/search';
