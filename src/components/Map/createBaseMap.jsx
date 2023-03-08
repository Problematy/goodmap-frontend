import React from 'react';
import ReactDOM from 'react-dom';
import Leaflet from 'leaflet';
import { UserLocationMarker } from './components/UserLocationMarker/UserLocationMarker';
import { mapConfig } from './map.config';
import './components/LocationControl/LocationControl';
import { SuggestNewPointButton } from '../Buttons/SuggestNewPointButton/SuggestNewPointButton';

export function createBaseMap(onLocationFound) {
    const map = Leaflet.map('map').setView(
        mapConfig.initialMapCoordinates,
        mapConfig.initialMapZoom,
    );
    const locationMarker = UserLocationMarker(mapConfig.initialMapCoordinates);
    const cMarker = Leaflet.circle(mapConfig.initialMapCoordinates, 2);
    const locationControl = new Leaflet.Control.Button();
    const mapBase = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: mapConfig.maxMapZoom,
        attribution:
            '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    });

    map.zoomControl.setPosition('topright');
    map.addLayer(mapBase);
    map.on('locationfound', e => {
        onLocationFound(e, map, locationMarker, cMarker);
    });
    map.locate({ setView: false, watch: true, maxZoom: 16 });

    // add
    const MyBtn = Leaflet.Control.extend({
        options: {
            position: 'topleft',
        },
        onAdd: () => {
            const container = Leaflet.DomUtil.create('div', 'leaflet-control');
            ReactDOM.render(<SuggestNewPointButton />, container);

            // return the container
            return container;
        },
    });
    new MyBtn().addTo(map);
    locationControl.addTo(map);
    locationMarker.addTo(map);
    cMarker.addTo(map);

    return map;
}
