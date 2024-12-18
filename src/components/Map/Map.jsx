import ReactDOM from 'react-dom/client';
import React, { useEffect } from 'react';

import { httpService } from '../../services/http/httpService';
import { FiltersForm } from '../FiltersForm/FiltersForm';
import { MarkerPopup } from '../MarkerPopup/MarkerPopup';
import { MapComponent } from './MapComponent';
import { useMapStore } from './store/map.store';
import { ClusterMarker } from '../MarkerPopup/ClusterMarker';
import useDebounce from '../../utils/hooks/useDebounce';

const mapPlaceholder = ReactDOM.createRoot(document.getElementById('map'));
const filtersPlaceholder = ReactDOM.createRoot(document.getElementById('filter-form'));

function getSelectedCheckboxesOfCategory(filterType) {
    const checkedBoxesTypes = document.querySelectorAll(`.filter.${filterType}:checked`);
    const types = Array.from(checkedBoxesTypes)
        .map(checkboxNode => `${filterType}=${checkboxNode.value}`)
        .join('&');

    return types;
}

export async function getNewMarkers(categories) {
    const allCheckboxes = categories.map(([categoryString]) =>
        getSelectedCheckboxesOfCategory(categoryString),
    );
    let filtersUrlQueryString = allCheckboxes.filter(n => n).join('&');
    if (window.USE_SERVER_SIDE_CLUSTERING) {
        const mapConfigurationData = useMapStore.getState().mapConfiguration;
        if (mapConfigurationData) {
            const mapConfigQueryString = Object.entries(mapConfigurationData)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
            filtersUrlQueryString += `&${mapConfigQueryString}`;
        }
    }
    const locations = await httpService.getLocations(filtersUrlQueryString);

    if (window.USE_SERVER_SIDE_CLUSTERING) {
        return locations.map(location => {
            if (location.type === 'cluster') {
                return <ClusterMarker cluster={location} key={location.cluster_uuid} />;
            }
            return <MarkerPopup place={location} key={location.uuid} />;
        });
    }

    let markers = locations.map(location => {
        const locationKey =
            window.USE_LAZY_LOADING ?? false ? location.uuid : location.metadata.uuid;
        return <MarkerPopup place={location} key={locationKey} />;
    });
    return markers;
}

export async function repaintMarkers(categories) {
    try {
        const newMarkers = await getNewMarkers(categories);
        const mainMap = <MapComponent markers={newMarkers} />;
        mapPlaceholder.render(mainMap);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error repainting markers:', error);
    }
}

export const Map = async () => {
    httpService.getCategoriesData().then(categoriesData => {
        const parsedCategoriesData = categoriesData.map(categoryData => categoryData[0]);

        repaintMarkers(parsedCategoriesData);
        filtersPlaceholder.render(
            <FiltersForm
                categoriesData={categoriesData}
                onClick={() => repaintMarkers(parsedCategoriesData)}
            />,
        );
    });
};
