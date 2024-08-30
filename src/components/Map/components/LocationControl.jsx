import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Marker, CircleMarker, useMap } from 'react-leaflet';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';

import { LocationButton } from './LocationButton';

const createLocationIcon = () => {
    const locationIconJSX = <MyLocationIcon sx={{ color: 'black', fontSize: 22 }} />;
    const svgLocationIcon = ReactDOMServer.renderToString(locationIconJSX);

    return L.divIcon({
        html: svgLocationIcon,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -11],
        className: 'location-icon',
    });
};

const LocationControl = ({ setUserPosition: setUserPositionProp }) => {
    const [userPosition, setUserPosition] = useState(null);
    const map = useMap();

    const handleLocationFound = e => {
        setUserPosition(e.latlng);
        setUserPositionProp(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
    };

    map.on('locationfound', handleLocationFound);
    map.locate({ setView: false, maxZoom: 16, watch: true });

    if (!userPosition) {
        return null;
    }

    const { lat, lng } = userPosition;
    const radius = userPosition.accuracy / 2 || 0;

    return (
        <>
            <CircleMarker center={[lat, lng]} radius={radius} />
            <Marker position={userPosition} icon={createLocationIcon()} />
            <LocationButton userPosition={userPosition} />
        </>
    );
};

LocationControl.propTypes = {
    setUserPosition: PropTypes.func.isRequired,
};

export { LocationControl };
