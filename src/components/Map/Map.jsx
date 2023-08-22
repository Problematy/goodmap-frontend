import * as ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom/client';
import React from 'react';
import Leaflet from 'leaflet';


import 'leaflet.markercluster';

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";


import { httpService } from '../../services/http/httpService';
import { FiltersForm } from '../FiltersForm/FiltersForm';
import { MarkerPopup } from '../MarkerPopup/MarkerPopup';
import { MapComponent } from './createBaseMap';

let markers = Leaflet.markerClusterGroup();
let mainMap = null;
const mapPlaceholder = ReactDOM.createRoot(document.getElementById('map'));

function onLocationFound(e, _map, locationMarker, circleMarker) {
    const radius = e.accuracy / 2;
    locationMarker.setLatLng(e.latlng);
    circleMarker.setLatLng(e.latlng).setRadius(radius);
}

function getSelectedCheckboxesOfCategory(filterType) {
    const checkedBoxesTypes = document.querySelectorAll(`.filter.${filterType}:checked`);
    const types = Array.from(checkedBoxesTypes)
        .map(checkboxNode => `${filterType}=${checkboxNode.value}`)
        .join('&');

    return types;
}

async function createMarkersWithPopups(response) {
  const markers = [];

  for (const x of response) {
    const popupContent = (
      <Popup>
        <MarkerPopup place={x} />
      </Popup>
    );

    markers.push(
      <Marker position={x.position} key={x.id}>
        {popupContent}
      </Marker>
    );
  }

  return markers;
}

async function createMarkersWithPopupsOld(response) {
    const markersCluster = Leaflet.markerClusterGroup();

    for (const x of response) {
        const popupContent = <MarkerPopup place={x} />;
        Leaflet.marker(x.position)
            .addTo(markersCluster)
            .bindPopup(ReactDOMServer.renderToString(popupContent));
    }

    return markersCluster;
}

export function getNewMarkersOld(categories) {
    const markersCluster = Leaflet.markerClusterGroup();
    const allCheckboxes = categories.map(([categoryString]) =>
        getSelectedCheckboxesOfCategory(categoryString),
    );
    const filtersUrlQueryString = allCheckboxes.filter(n => n).join('&');

    httpService
        .getLocations(filtersUrlQueryString)
        .then(response => createMarkersWithPopups(response))
        .then(newMarkersCluster => {
            markersCluster.addLayers(newMarkersCluster.getLayers());
        })
        .catch(error => console.error(error));

    return markersCluster;
}

export async function getNewMarkers(categories) {
    const allCheckboxes = categories.map(([categoryString]) =>
        getSelectedCheckboxesOfCategory(categoryString),
    );
    const filtersUrlQueryString = allCheckboxes.filter(n => n).join('&');
    const locations = await httpService.getLocations(filtersUrlQueryString);
    return locations.map(location => (
        <Marker position={location.position}>
            <Popup>
                <MarkerPopup place={location} />
            </Popup>
        </Marker>
    ));
}


export async function repaintMarkers(categories) {
  try {
    const newMarkers = await getNewMarkers(categories);

    const mainMap = (
      <MapComponent markers={newMarkers} />
    );

    mapPlaceholder.render(mainMap);
  } catch (error) {
    console.error('Error repainting markers:', error);
  }
}

export const Map = async () => {
    httpService.getCategoriesData().then(categoriesData => {
        const parsedCategoriesData = categoriesData.map(categoryData => categoryData[0]);
        const filtersPlaceholder = ReactDOM.createRoot(document.getElementById('filter-form'));

        repaintMarkers(parsedCategoriesData);
        filtersPlaceholder.render(
            <FiltersForm
                categoriesData={categoriesData}
                onClick={() => repaintMarkers(parsedCategoriesData)}
            />,
        );
    });
};
