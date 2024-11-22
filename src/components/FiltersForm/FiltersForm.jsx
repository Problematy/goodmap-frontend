import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCategories } from '../Categories/CategoriesContext';
import { httpService } from '../../services/http/httpService';

export const FiltersForm = () => {
    const { setCategories } = useCategories();
    const [selectedFilters, setSelectedFilters] = useState({});
    const [categoriesData, setCategoriesData] = useState([]);

    // Funkcja obsługująca zmianę checkboxa
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        const category = event.target.classList[2];

        setCategories((prevSelectedFilters) => {
            const newSelectedFilters = { ...prevSelectedFilters };

            if (checked) {
                if (newSelectedFilters[category]) {
                    newSelectedFilters[category].push(value);
                } else {
                    newSelectedFilters[category] = [value];
                }
            } else {
                newSelectedFilters[category] = newSelectedFilters[category].filter(
                    (filter) => filter !== value
                );
            }

            return newSelectedFilters;
        });
    };

//     // Synchronizacja selectedFilters z CategoriesProvider
//     useEffect(() => {
//         setCategories(selectedFilters);
//     }, [selectedFilters, setCategories]);
//
//     // Pobranie danych kategorii
    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesData = await httpService.getCategoriesData();
            setCategoriesData(categoriesData);
        };
        fetchCategories();
    }, []);

    // Generowanie sekcji filtrów
    const sections = categoriesData.map((filtersData) => (
        <div
            key={`${filtersData[0][0]}-${filtersData[0][1]}`}
            aria-labelledby={`filter-label-${filtersData[0][0]}-${filtersData[0][1]}`}
        >
            <span id={`filter-label-${filtersData[0][0]}-${filtersData[0][1]}`}>
                {filtersData[0][1]}
            </span>
            {filtersData[1].map(([name, translation]) => (
                <div className="form-check" key={`${filtersData[0][0]}-${name}`}>
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
