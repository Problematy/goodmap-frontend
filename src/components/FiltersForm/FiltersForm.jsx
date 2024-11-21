import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FilterFormCategory } from './components/FilterFormCategory';



export const FiltersForm = ({ categoriesData, onChange }) => {

    const [selectedFilters, setSelectedFilters] = useState({});

    // handleCheckboxChange stores filters like that {categoryName: [filters which are checked], categoryName2: [filters which are checked}
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        const category = event.target.classList[2];
        setSelectedFilters((prevSelectedFilters) => {
            const newSelectedFilters = { ...prevSelectedFilters };
            if (checked) {
                if (newSelectedFilters[category]) {
                    newSelectedFilters[category].push(value);
                } else {
                    newSelectedFilters[category] = [value];
                }
            } else {
                newSelectedFilters[category] = newSelectedFilters[category].filter(
                    (filter) => filter !== value,
                );
            }
            onChange(newSelectedFilters);
            // log type of newSelectedFilters
            console.log(typeof newSelectedFilters);
            return newSelectedFilters;
        });
    };

    const sections = categoriesData.map(filtersData => (
//     const categoryData = filtersData[0];
//     const subcategoryData = filtersData[1];
//         <FilterFormCategory key={categoryData[0][0]} filtersData={categoryData} onChange={handleCategoryChange} />
//

        <div
            key={`${filtersData[0][0]} ${filtersData[0][1]}`}
            aria-labelledby={`filter-label-${filtersData[0][0]}-${filtersData[0][1]}`}
        >
            <span id={`filter-label-${filtersData[0][0]}-${filtersData[0][1]}`}>
                {' '}
                {filtersData[0][1]}
            </span>
            {filtersData[1].map(([name, translation]) => (
                <div className="form-check" key={name}>
                    <label htmlFor={name}>
                        {translation}
                        <input
                            onChange={handleCheckboxChange}
                            className={`form-check-input filter ${filtersData[0][0]}`}
                            type="checkbox"
                            id={name}
                            value={name}
                        />
                    </label>
                </div>
            ))}
        </div>
    ));

    return <form>{sections}</form>;
};

FiltersForm.propTypes = {
    categoriesData: PropTypes.arrayOf(
        PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.arrayOf(PropTypes.string),
                PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
            ]),
        ),
    ).isRequired,
    onChange: PropTypes.func.isRequired,
};
