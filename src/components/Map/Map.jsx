import ReactDOM from 'react-dom/client';
import React from 'react';

import { httpService } from '../../services/http/httpService';
import { FiltersForm } from '../FiltersForm/FiltersForm';
import { MarkerPopup } from '../MarkerPopup/MarkerPopup';
import { MapComponent } from './MapComponent';

const mapPlaceholder = ReactDOM.createRoot(document.getElementById('map'));
const filtersPlaceholder = ReactDOM.createRoot(document.getElementById('filter-form'));

export async function getNewMarkers(filters) {
  const query = Object.entries(filters).map(filter => filter[1].map(value => `${filter[0]}=${value}`).join('&')).join('&');
  const locations = await httpService.getLocations(query);
  return locations.map(location => {
      const locationKey =
          window.USE_LAZY_LOADING ?? false ? location.UUID : location.metadata.UUID;
      return <MarkerPopup place={location} key={locationKey} />;
  });
}

export async function repaintMarkers(filters) {
    try {
  const markers = await getNewMarkers(filters);
  const mainMap = <MapComponent markers={markers} />;
  mapPlaceholder.render(mainMap);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error repainting markers:', error);
    }

};

export const Map = async () => {
    httpService.getCategoriesData().then(categoriesData => {
        repaintMarkers({});
        filtersPlaceholder.render(
            <FiltersForm
                categoriesData={categoriesData}
                onChange={(filters)=>{
                    repaintMarkers(filters);
                    console.log(filters);
                }}
            />,
        );
    });
};
