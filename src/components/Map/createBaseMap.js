import Leaflet from 'leaflet';
import { UserLocationMarker, locationIcon } from './components/UserLocationMarker/UserLocationMarker';
import { mapConfig } from './map.config';
import './components/LocationControl/LocationControl';

import React from 'react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from "react-leaflet-markercluster";

export function createBaseMapOld(onLocationFound) {
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

    locationControl.addTo(map);
    locationMarker.addTo(map);
    cMarker.addTo(map);

    return map;
}

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [positionAccuracy, setPositionAccuracy] = useState(null);
  const map = useMap();

  const startTrackingLocation = () => {
    const watchId = map.locate({ watch: true }).on('locationfound', handleLocationFound);
    return () => {
      map.stopLocate();
      watchId();
    };
  };

  const handleLocationFound = (e) => {
    setPosition(e.latlng);
    setPositionAccuracy(e.accuracy);
    map.flyTo(e.latlng, map.getZoom());
  };

  useEffect(() => {
    const cleanup = startTrackingLocation();
    return cleanup;
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={locationIcon}>
      <Popup>You are here</Popup>
      <Circle center={position} radius={positionAccuracy / 10} />
    </Marker>
  );
}


export function createBaseMap(markers) {
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

        {markers}

        <LocationMarker />



    </MapContainer>
    );
}
