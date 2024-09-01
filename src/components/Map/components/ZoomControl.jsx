import React from 'react';
import { useMap } from 'react-leaflet';
import Control from 'react-leaflet-custom-control';
import { Button, Divider } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn'; // Zoom in icon
import ZoomOutIcon from '@mui/icons-material/ZoomOut'; // Zoom out icon

const zoomButtonStyle = {
    width: '100px',
    height: '50px',
    minWidth: '100px',
    borderRadius: '10%',
    backgroundColor: window.SECONDARY_COLOR,
    color: 'white',
    fontSize: '30px',
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

export const CustomZoomControl = () => {
    const map = useMap();

    const handleZoomIn = () => {
        map.zoomIn();
    };

    const handleZoomOut = () => {
        map.zoomOut();
    };

    return (
        <Control prepend position="topright">
            <Button style={zoomButtonStyle} variant="contained">
                <ZoomInIcon onClick={handleZoomIn} style={{ color: 'white', fontSize: 35, marginRight: '10px' }} /> {/* Zoom in icon with right margin */}
                <Divider orientation="vertical" flexItem style={{ backgroundColor: 'white' }} />
                <ZoomOutIcon onClick={handleZoomOut} style={{ color: 'white', fontSize: 35, marginLeft: '10px' }} /> {/* Zoom out icon with left margin */}
            </Button>
        </Control>
    );
};
