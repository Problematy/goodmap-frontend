import React, { useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import PropTypes from 'prop-types';
import { LocationControl } from './components/LocationControl';
import { mapConfig } from './map.config';

export const MapComponent = ({ markers }) => {
    const [userPosition, setUserPosition] = useState(null);

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
            <MarkerClusterGroup>
                {markers.map((marker, index) => React.cloneElement(marker, { key: index }))}
            </MarkerClusterGroup>
            <LocationControl setUserPosition={setUserPosition} />
            <ZoomControl position="topright" />
        </MapContainer>
    );
}

MapComponent.propTypes = {
    markers: PropTypes.arrayOf(
        PropTypes.shape({
            props: PropTypes.shape({
                position: PropTypes.arrayOf(PropTypes.number),
            }),
        }),
    ).isRequired,
};