import React from 'react';
import PropTypes from 'prop-types';
import { FilterFormCategory } from './components/FilterFormCategory';

export const FiltersForm = ({ categoriesData, onClick }) => {

    const [selectedFilters, setSelectedFilters] = useState({});

    const handleCategoryChange = (categoryName, selectedItems) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters, [categoryName]: selectedItems };
            onChange(updatedFilters); // Notify parent of updated filters
            return updatedFilters;
        });
    };

    const onChange = (e) => {

    }

    const sections = categoriesData.map(categoryData => (
        <FilterFormCategory key={categoryData[0][0]} filtersData={categoryData} onClick={onClick} />
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
    onClick: PropTypes.func.isRequired,
};
