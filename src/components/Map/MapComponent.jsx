import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Control from 'react-leaflet-custom-control';
import { LocationControl } from './components/LocationControl';
import { SuggestNewPointButton } from './components/SuggestNewPointButton';
import { mapConfig } from './map.config';
import { CustomZoomControl } from './components/ZoomControl';
import MapAutocomplete from './components/MapAutocomplete';
import ListViewButton from './components/ListView';
import AccessibilityTable from './components/AccessibilityTable';
import SaveMapConfiguration from './components/SaveMapConfiguration';
import { toast } from '../../utils/toast';
import { useTranslation } from 'react-i18next';
import { AppToaster } from '../common/AppToaster';
import { Markers } from './components/Markers';
import { LoadingScreen } from '../LoadingScreen/LoadingScreen';

const StyledLoadingScreen = styled(LoadingScreen)`
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
`;

export const MapComponent = () => {
    const { t } = useTranslation();

    const [userPosition, setUserPosition] = useState(null);
    const [isListViewOpen, setIsListViewOpen] = useState(false);
    const [areMarkersLoaded, setAreMarkersLoaded] = useState(false);
    const [isTableLoaded, setIsTableLoaded] = useState(true);

    const handleListViewButtonClick = () => {
        if (!userPosition) {
            toast.error(t('listViewButtonUserLocation'));
            return;
        }
        setIsTableLoaded(false);
        setIsListViewOpen(!isListViewOpen);
    };

    if (isListViewOpen) {
        return (
            <>
                {!isTableLoaded && <StyledLoadingScreen />}
                <AccessibilityTable
                    userPosition={userPosition}
                    setIsAccessibilityTableOpen={setIsListViewOpen}
                    setIsTableLoaded={setIsTableLoaded}
                />
            </>
        );
    }

    return (
        <>
            {!areMarkersLoaded && <StyledLoadingScreen />}
            <AppToaster />
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
                    <Markers setAreMarkersLoaded={setAreMarkersLoaded} />
                )}
                {window.USE_SERVER_SIDE_CLUSTERING && markers}
                <LocationControl setUserPosition={setUserPosition} />
                <CustomZoomControl position="topright" />
                {window.SHOW_ACCESSIBILITY_TABLE && (
                    <ListViewButton onClick={handleListViewButtonClick} />
                )}
                {window.SHOW_SEARCH_BAR && <MapAutocomplete />}
            </MapContainer>
        </>
    );
};
//
// MapComponent.propTypes = {
//     markers: PropTypes.arrayOf(PropTypes.element).isRequired,
// };
