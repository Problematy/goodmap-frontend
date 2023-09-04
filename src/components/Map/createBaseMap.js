import React from 'react';

import { MapContainer, TileLayer } from 'react-leaflet';
import { createControlComponent } from '@react-leaflet/core';
import MarkerClusterGroup from 'react-leaflet-cluster';

import Control from 'react-leaflet-custom-control';
import { LocationMarker, LocationControl } from './components/LocationControl/LocationControl';
import { mapConfig } from './map.config';

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

        <LocationMarker />
        <LocationControl />
    </MapContainer>
);
