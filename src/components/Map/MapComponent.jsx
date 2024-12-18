import React, { useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import PropTypes from 'prop-types';
import { LocationControl } from './components/LocationControl';
import { SuggestNewPointButton } from './components/SuggestNewPointButton';
import { mapConfig } from './map.config';
import { CustomZoomControl } from './components/ZoomControl';
import Control from 'react-leaflet-custom-control';
import MapAutocomplete from './components/MapAutocomplete';
import useSaveMapConfiguration from './components/SaveMapConfiguration';
import SaveMapConfiguration from './components/SaveMapConfiguration';

export const MapComponent = ({ markers }) => {
    const [, setUserPosition] = useState(null);

    return (
        <MapContainer
            center={mapConfig.initialMapCoordinates}
            zoom={mapConfig.initialMapZoom}
            scrollWheelZoom
            style={{ height: '100%' }}
            zoomControl={false}
        >
            <SaveMapConfiguration />
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
            {!window.USE_SERVER_SIDE_CLUSTERING && (
                <MarkerClusterGroup>{markers}</MarkerClusterGroup>
            )}
            {window.USE_SERVER_SIDE_CLUSTERING && markers}
            <LocationControl setUserPosition={setUserPosition} />
            <CustomZoomControl position="topright" />
            {window.SHOW_SEARCH_BAR && <MapAutocomplete />}
        </MapContainer>
    );
};

MapComponent.propTypes = {
    markers: PropTypes.arrayOf(PropTypes.element).isRequired,
};
