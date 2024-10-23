import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Marker, CircleMarker, useMap } from 'react-leaflet';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';
import { Snackbar, Button } from '@mui/material';
import Control from 'react-leaflet-custom-control';
import { useTranslation } from 'react-i18next';
import { buttonStyle } from '../../../styles/buttonStyle';

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
    const { t } = useTranslation();
    const [userPosition, setUserPosition] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const map = useMap();

    const flyToLocation = (location, mapInstance) => {
        console.log("now we will fly to location");
        const zoomLevel = mapInstance.getZoom() < 16 ? 16 : mapInstance.getZoom();
        mapInstance.flyTo(location, zoomLevel);
    };

    // what should happen, when user's location changes (event)
    const handleLocationFound = e => {
        console.log("user location changed");
        setUserPosition(e.latlng);
        setUserPositionProp(e.latlng);
        // flyToLocation(e.latlng, map);
        //
        // ^ This change solves the bug, since now flyToLocation
        // happens only, when the button is clicked.
        // However, now we have another bug: you have to click the button
        // twice, before you actually get taken to your position.
        // This is because the click handler installs the map.locate function,
        // which starts producing locationfound events. Before it is installed,
        // the userPosition value is null, so flyToLocation won't happen.
    };

    const handleLocationError = e => {
        if (e.code === 1) {
            // User denied Geolocation
            setSnackbarOpen(true);
            setUserPosition(null);
        }
        map.stopLocate();
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // what should happen when user clicks "locate me" button
    const handleFlyToLocationClick = () => {
        console.log("'locate me' button clicked");
        map.locate({ setView: false, maxZoom: 16, watch: true });
        console.log(`userPosition = ${userPosition}`);
        if (userPosition) {
            flyToLocation(userPosition, map);
        }
    };

    useEffect(() => {
        map.on('locationfound', handleLocationFound);
        map.on('locationerror', handleLocationError);

        return () => {
            map.off('locationfound', handleLocationFound);
            map.off('locationerror', handleLocationError);
        };
    }, [map]);

    const { lat, lng } = userPosition || {};
    const radius = (userPosition && userPosition.accuracy / 2) || 0;

    return (
        <>
            {userPosition && (
                <>
                    <CircleMarker center={[lat, lng]} radius={radius} />
                    <Marker position={userPosition} icon={createLocationIcon()} />
                </>
            )}
            <Control prepend position="bottomright">
                <Button
                    onClick={handleFlyToLocationClick}
                    style={buttonStyle}
                    variant="contained"
                    aria-label={t('centerButtonAriaLabel')}
                >
                    <MyLocationIcon style={{ color: 'white', fontSize: 24 }} />
                </Button>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={handleSnackbarClose}
                    message="Please enable location services to see your location on the map."
                />
            </Control>
        </>
    );
};

LocationControl.propTypes = {
    setUserPosition: PropTypes.func.isRequired,
};

export { LocationControl };
