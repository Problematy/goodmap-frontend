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
import { useCategories } from '../Categories/CategoriesContext';
import { httpService } from '../../services/http/httpService';
import { MarkerPopup } from '../MarkerPopup/MarkerPopup';


export const MapComponent = () => {
    const [, setUserPosition] = useState(null);
    const [markers, setMarkers] = useState([]);
    const { categories } = useCategories();

    useEffect(() => {
        const query = Object.entries(categories).map(filter => filter[1].map(value => `${filter[0]}=${value}`).join('&')).join('&');
        const fetchMarkers = async () => {

            const marks = await httpService.getLocations(query);
            const markeros = marks.map(location => <MarkerPopup place={location} key={location.UUID} />);
            const mark = <MarkerClusterGroup>{markeros}</MarkerClusterGroup>;
            console.log('markers rdy')
            setMarkers(mark);
        };
        fetchMarkers();
    }, [categories]);


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
            {markers}
            <LocationControl setUserPosition={setUserPosition} />
            <CustomZoomControl position="topright" />
            {window.SHOW_SEARCH_BAR && <MapAutocomplete />}
        </MapContainer>
    );
};
// 41 sekund oryginał
// 25 zaklastrowane
