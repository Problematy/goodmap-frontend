import React from 'react';
import PropTypes from 'prop-types';

// function which changes which variable has been changed
export const handleCheckboxChange = (event) => {
    const { value } = event.target;

};


export const Checkbox = ({ name, translation, categoryName }) => (
    <div className="form-check">
        <label htmlFor={name}>
            {translation}
            <input
                onChange={handleCheckboxChange}
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

};
