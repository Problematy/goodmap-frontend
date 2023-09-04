import React, { useState, useEffect } from 'react';
import { Marker, CircleMarker, useMap } from 'react-leaflet';
import { Button, Box } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import Control from 'react-leaflet-custom-control';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';

const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  const addLocationMarker = (latlng, accuracy) => {
    setPosition(latlng);
  };

  useEffect(() => {
    const updateLocation = () => {
      map.locate().on('locationfound', function (e) {
        addLocationMarker(e.latlng, e.accuracy);
      });
    };

    const handleLocationFound = (e) => {
      map.flyTo(e.latlng, map.getZoom());
    };

    map.once('locationfound', handleLocationFound);

    updateLocation();

    const locationUpdateInterval = setInterval(updateLocation, 5000);

    return () => {
      clearInterval(locationUpdateInterval);
      map.off('locationfound', handleLocationFound);
    };
  }, [map]);

  if (!position) {
    return null;
  }

  const { lat, lng } = position;
  const radius = position.accuracy / 2 || 0;

  return (
    <>
      <CircleMarker center={[lat, lng]} radius={radius} />
      <Marker position={position} icon={locationIcon} />
    </>
  );
};

const locationIconJSX = <MyLocationIcon sx={{ color: 'black', fontSize: 22 }} />;
const svgLocationIcon = ReactDOMServer.renderToString(locationIconJSX);

const locationIcon = L.divIcon({
  html: svgLocationIcon,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -11],
  className: 'location-icon',
});

const LocationControl = () => {
  const map = useMap();

  const handleFlyToLocationClick = () => {
    map.locate();
    map.once('locationfound', function (e) {
      map.flyTo(e.latlng, map.getZoom());
    });
  };

  return (
    <Control prepend position="bottomright">
      <Button onClick={handleFlyToLocationClick}>
        <Box sx={{ boxShadow: 1.3, border: 0.1, color: 'black', padding: 0.5, background: 'white' }}>
          {locationIconJSX}
        </Box>
      </Button>
    </Control>
  );
};

export { LocationMarker, LocationControl };
