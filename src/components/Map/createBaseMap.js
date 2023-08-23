import { mapConfig } from './map.config';
import { LocationMarker } from './components/LocationControl/LocationControl';

import React from 'react';

import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";

export function MapComponent({ markers }) {
  return (
    <MapContainer
      center={mapConfig.initialMapCoordinates}
      zoom={mapConfig.initialMapZoom}
      scrollWheelZoom={true}
      style={{ height: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&amp;copy <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        maxZoom={mapConfig.maxMapZoom}
      />

      <MarkerClusterGroup>
        {markers}
      </MarkerClusterGroup>

      <LocationMarker />
    </MapContainer>
  );
}
