import deprecate from 'util-deprecate';

/**
 * Cross-environment global object accessor.
 * Provides backward-compatible access to global variables set by external code.
 *
 * Uses globalThis (modern standard) with fallback to window (legacy browsers).
 * This satisfies SonarQube's preference for globalThis while maintaining compatibility
 * with environments where external code sets window.FEATURE_FLAGS and window.APP_LANG.
 *
 * @deprecated Deprecated in 0.5.0, will be removed in 1.0.0.
 *             Use globalThis directly instead of this compatibility wrapper.
 *
 * @returns {Window|globalThis} The global object
 */
const getGlobalObject = () => {
    // Use globalThis if available (ES2020+), otherwise fall back to window
    return typeof globalThis !== 'undefined' ? globalThis : window;
};

// Wrap with deprecation warning using util-deprecate
// The warning will only show in test/development environments by default
const deprecatedGetGlobalObject = deprecate(
    getGlobalObject,
    'getGlobalObject() from src/utils/globalCompat.js is deprecated (since v0.5.0, will be removed in v1.0.0). ' +
    'Use globalThis directly instead. This is a temporary compatibility shim that will be removed in the next major release.'
);

export default deprecatedGetGlobalObject;
