import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from './Checkbox';

const handleCheckboxChange = (event) => {
    const { value } = event.target;
    console.log(value);
};

export const FilterFormCategory = ({ filtersData, onChange }) => {
    const categoryData = filtersData[0];
    const subcategoryData = filtersData[1];

    return (
        <div
            key={`${categoryData[0]} ${categoryData[1]}`}
            aria-labelledby={`filter-label-${categoryData[0]}-${categoryData[1]}`}
        >
            <span id={`filter-label-${categoryData[0]}-${categoryData[1]}`}>
                {' '}
                {categoryData[1]}
            </span>
            {subcategoryData.map(([name, translation]) => (
                <div className="form-check" key={name}>
                    <label htmlFor={name}>
                        {translation}
                        <input
                            onChange={handleCheckboxChange}
                            className={`form-check-input filter ${categoryData[0]}`}
                            type="checkbox"
                            id={name}
                            value={name}
                        />
                    </label>
                </div>
            ))}
        </div>
    );
};

FilterFormCategory.propTypes = {
    filtersData: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
        ]),
    ).isRequired,
    onChange: PropTypes.func.isRequired,
};
