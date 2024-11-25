import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { LocationControl } from './components/LocationControl';
import { SuggestNewPointButton } from './components/SuggestNewPointButton';
import { mapConfig } from './map.config';
import { CustomZoomControl } from './components/ZoomControl';
import Control from 'react-leaflet-custom-control';
import MapAutocomplete from './components/MapAutocomplete';
import { Markers } from './components/Markers';

export const MapComponent = () => {
    const [, setUserPosition] = useState(null);

    return (
        <MapContainer
            center={mapConfig.initialMapCoordinates}
            zoom={mapConfig.initialMapZoom}
            scrollWheelZoom
            style={{ height: '100%' }}
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&amp;copy <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                maxZoom={mapConfig.maxMapZoom}
            />
            {window.SHOW_SUGGEST_NEW_POINT_BUTTON && (
                <Control position="bottomright" prepend>
                    <SuggestNewPointButton />
                </Control>
            )}
            <Markers />
            <LocationControl setUserPosition={setUserPosition} />
            <CustomZoomControl position="topright" />
            {window.SHOW_SEARCH_BAR && <MapAutocomplete />}
        </MapContainer>
    );
};
