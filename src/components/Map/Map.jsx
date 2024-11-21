import ReactDOM from 'react-dom/client';
import React from 'react';

import { httpService } from '../../services/http/httpService';
import { FiltersForm } from '../FiltersForm/FiltersForm';
import { MarkerPopup } from '../MarkerPopup/MarkerPopup';
import { MapComponent } from './MapComponent';

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
//     console.log(categories);
    const allCheckboxes = categories.map(([categoryString]) =>
        getSelectedCheckboxesOfCategory(categoryString),
    );
//     console.log('allCheckboxes', allCheckboxes);
    const filtersUrlQueryString = allCheckboxes.filter(n => n).join('&');
//     console.log('filtersUrlQueryString', filtersUrlQueryString)
    const locations = await httpService.getLocations(filtersUrlQueryString);

    let markers = locations.map(location => {
        const locationKey =
            window.USE_LAZY_LOADING ?? false ? location.UUID : location.metadata.UUID;
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
        console.log('parsedCategoriesData', parsedCategoriesData);
        console.log('categoriesData', categoriesData);

        const repaintMarkersButReal= ((filters) => {
          console.log('repaint filters',filters);
          const queries = Object.entries(filters).map(filter => filter[1].map(value => `${filter[0]}=${value}`).join('&')).join('&');
          console.log('query', queries);
          });

//           const query_string = filters[0].map(checkboxNode => `${filterType}=${checkboxNode.value}`).join('&');
//           console.log('listOfCategories', listOfCategories);
//           console.log('query', query_string);


        repaintMarkers(parsedCategoriesData);
        filtersPlaceholder.render(
            <FiltersForm
                categoriesData={categoriesData}
                onChange={(filters)=>{
                    repaintMarkersButReal(filters);
                    console.log(filters);
                }}
//                 onChange={(categories) => repaintMarkers(categories)}
            />,
        );
    });
};
