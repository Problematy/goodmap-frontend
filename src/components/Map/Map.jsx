import * as ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom/client';
import React from 'react';
import Leaflet from 'leaflet';


import 'leaflet.markercluster';

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";


import { httpService } from '../../services/http/httpService';
import { FiltersForm } from '../FiltersForm/FiltersForm';
import { MarkerPopup } from '../MarkerPopup/MarkerPopup';
import { createBaseMap } from './createBaseMap';

let markers = Leaflet.markerClusterGroup();
let mainMap = null;

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

export function getNewMarkers(categories) {

      let position = [51.505, -0.09];
                return (
                    <Marker position={position}>
                        <Popup>
                            <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
                        </Popup>
                    </Marker>
                    );


}


export const repaintMarkers = categories => {
    let oldMarkers = markers;
    markers = getNewMarkers(categories);
    mainMap = createBaseMap(markers);
    const mapPlaceholder = ReactDOM.createRoot(document.getElementById('map'));

    mapPlaceholder.render(mainMap);

};

export const Map = async () => {
    const categories = await httpService.getCategories();
    mainMap =  createBaseMap(markers); //createBaseMap(onLocationFound);

//    mainMap.addLayer(markers);
//    getNewMarkers(categories);

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
