import React from 'react';
import PropTypes from 'prop-types';

import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import { LocationControl } from './components/LocationControl/LocationControl';
import { mapConfig } from './map.config';

const markerPropTypes = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
});

export const MapComponent = ({ markers }) => (
    <MapContainer
        center={mapConfig.initialMapCoordinates}
        zoom={mapConfig.initialMapZoom}
        scrollWheelZoom
        style={{ height: '100%' }}
    >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&amp;copy <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            maxZoom={mapConfig.maxMapZoom}
        />

        <MarkerClusterGroup>{markers}</MarkerClusterGroup>

        <LocationControl />
    </MapContainer>
);

MapComponent.propTypes = {
    markers: PropTypes.arrayOf(markerPropTypes).isRequired, // Use PropTypes.arrayOf() with the markerPropTypes
};
