import React from 'react';
import PropTypes from 'prop-types';

export const Checkbox = ({ name, translation, categoryName, onChange }) => (
    <div className="form-check">
        <label htmlFor={name}>
            {translation}
            <input
                onChange={onChange}
                className={`form-check-input filter ${categoryName}`}
                type="checkbox"
                id={name}
                value={name}
            />
        </label>
    </div>
);

Checkbox.propTypes = {
    name: PropTypes.string.isRequired,
    translation: PropTypes.string.isRequired,
    categoryName: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
