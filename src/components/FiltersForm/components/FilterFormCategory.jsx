import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from './Checkbox';

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
                <Checkbox
                    key={name}
                    name={name}
                    translation={translation}
                    categoryName={categoryData[0]}
                    onChange={onChange}
                />
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
