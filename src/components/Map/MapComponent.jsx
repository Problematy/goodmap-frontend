import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import PropTypes from 'prop-types';
import Control from 'react-leaflet-custom-control';
import { LocationControl } from './components/LocationControl';
import { SuggestNewPointButton } from './components/SuggestNewPointButton';
import { mapConfig } from './map.config';
import { CustomZoomControl } from './components/ZoomControl';
import MapAutocomplete from './components/MapAutocomplete';
import NavigateMeButton from './components/NavigateMeButton';
import AccessibilityTable from './components/AccessibilityTable';
import { toast } from '../../utils/toast';
import { useTranslation } from 'react-i18next';
import { AppToaster } from '../common/AppToaster';

export const MapComponent = ({ markers, categories, allCheckboxes }) => {
    const { t } = useTranslation();

    const [userPosition, setUserPosition] = useState(null);
    const [isAccessibilityTableOpen, setIsAccessibilityTableOpen] = useState(false);

    const handleNavigateMeButtonClick = () => {
        if (!userPosition) {
            toast.error(t('navigateMeButtonUserLocation'));
            return;
        }
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
        <>
            <AppToaster />
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
                <MarkerClusterGroup>{markers}</MarkerClusterGroup>
                <LocationControl setUserPosition={setUserPosition} />
                <CustomZoomControl position="topright" />
                <NavigateMeButton onClick={handleNavigateMeButtonClick} />
                {window.SHOW_SEARCH_BAR && <MapAutocomplete />}
            </MapContainer>
        </>
    );
};

MapComponent.propTypes = {
    markers: PropTypes.arrayOf(PropTypes.element).isRequired,
};
