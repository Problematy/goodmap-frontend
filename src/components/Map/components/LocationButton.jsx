import React from 'react';
import { useMap } from 'react-leaflet';
import PropTypes from 'prop-types';
import Control from 'react-leaflet-custom-control';
import { Button, Box } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const buttonStyle = {
    width: '50px',
    height: '50px',
    minWidth: '50px',
    borderRadius: '50%',
    backgroundColor: '#3d91e5',
    color: 'white',
    fontSize: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    lineHeight: '1',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
};

export const LocationButton = ({ userPosition = null }) => {
    const map = useMap();

    const handleFlyToLocationClick = () => {
        if (!userPosition) {
            map.locate({ setView: true, maxZoom: 16 });
        } else {
            const zoomLevel = map.getZoom() < 16 ? 16 : map.getZoom();
            map.flyTo(userPosition, zoomLevel);
        }
    };

    return (
        <Control prepend position="bottomright">
            <Button onClick={handleFlyToLocationClick} style={buttonStyle} variant="contained">
                <MyLocationIcon style={{ color: 'white', fontSize: 24 }} />
            </Button>
        </Control>
    );
};

const positionType = PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
});

LocationButton.propTypes = {
    userPosition: positionType,
};
