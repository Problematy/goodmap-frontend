import React from 'react';
import { MarkerCTAButtonStyle } from '../../styles/buttonStyle';
import getGlobalObject from '../../utils/globalCompat';

/**
 * Converts data to a string representation.
 * Arrays are joined with comma-space separator, other values are returned as-is.
 *
 * @param {*} data - Data to convert to string
 * @returns {string|*} Joined string if array, otherwise the original data
 */
export const getContentAsString = data => (Array.isArray(data) ? data.join(', ') : data);

/**
 * Maps custom typed values to appropriate React components.
 * Supports hyperlinks and CTA (Call-To-Action) buttons.
 *
 * @param {Object} customValue - Custom value object with type and value properties
 * @param {string} customValue.type - Type of custom value ('hyperlink' or 'CTA')
 * @param {string} customValue.value - URL or value to use
 * @param {string} [customValue.displayValue] - Optional display text (falls back to value)
 * @returns {React.ReactElement|string} React component for the custom type or string content
 * @throws {Error} If customValue is missing type or value properties
 */
export const mapCustomTypeToReactComponent = customValue => {
    if (!customValue.type || !customValue.value) {
        throw new Error('Custom value must have type and value properties');
    }

    const valueToDisplay = customValue?.displayValue || customValue.value;

    switch (customValue.type) {
        case 'hyperlink':
            return (
                <a href={customValue.value} rel="noreferrer noopener" target="_blank">
                    {valueToDisplay}
                </a>
            );
        case 'CTA':
            const handleRedirect = () => {
                const globalObj = getGlobalObject();
                globalObj.open(customValue.value, '_blank');
            };
            return (
                <button
                    type="button"
                    onClick={handleRedirect}
                    style={MarkerCTAButtonStyle}
                    variant="contained"
                >
                    {valueToDisplay}
                </button>
            );
        default:
            return getContentAsString(valueToDisplay);
    }
};
