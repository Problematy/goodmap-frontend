import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import PropTypes from 'prop-types';
import { LocationControl } from './components/LocationControl';
import { SuggestNewPointButton } from './components/SuggestNewPointButton';
import { mapConfig } from './map.config';
import { CustomZoomControl } from './components/ZoomControl';
import Control from 'react-leaflet-custom-control';
import MapAutocomplete from './components/MapAutocomplete';
import NavigateMeButton from './components/NavigateMeButton';
import AccessibilityTable from './components/AccessibilityTable';

export const MapComponent = ({ markers, categories, allCheckboxes }) => {
    const [userPosition, setUserPosition] = useState(null);
    const [isAccessibilityTableOpen, setIsAccessibilityTableOpen] = useState(false);

    const handleNavigateMeButtonClick = () => {
        setIsAccessibilityTableOpen(!isAccessibilityTableOpen);
    };

    if (isAccessibilityTableOpen) {
        return (
            <AccessibilityTable
                userPosition={userPosition}
                setIsAccessibilityTableOpen={setIsAccessibilityTableOpen}
                allCheckboxes={allCheckboxes}
            />
        );
    }

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
            {process.env.NODE_ENV === 'development' && (
                <Control position="bottomright" prepend>
                    <SuggestNewPointButton />
                </Control>
            )}
            <MarkerClusterGroup>{markers}</MarkerClusterGroup>
            <LocationControl setUserPosition={setUserPosition} />
            <CustomZoomControl position="topright" />
            <MapAutocomplete />
            {userPosition && <NavigateMeButton onClick={handleNavigateMeButtonClick} />}
        </MapContainer>
    );
};

MapComponent.propTypes = {
    markers: PropTypes.arrayOf(PropTypes.element).isRequired,
};
