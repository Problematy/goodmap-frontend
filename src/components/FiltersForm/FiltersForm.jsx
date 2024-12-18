import React from 'react';
import PropTypes from 'prop-types';
import { FilterFormCategory } from './components/FilterFormCategory';
import useDebounce from '../../utils/hooks/useDebounce';
import { useEffect } from 'react';
import { useMapStore } from '../Map/store/map.store';

export const FiltersForm = ({ categoriesData, onClick }) => {
    const mapConfiguration = useMapStore(state => state.mapConfiguration);
    const mapConfigDebounced = useDebounce(mapConfiguration, 5000);

    useEffect(() => {
        if (mapConfigDebounced === null) {
            return;
        }
        onClick();
    }, [mapConfigDebounced]);

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
