import React from 'react';
import { useState, useEffect } from 'react';
import { Marker, Popup, Circle, CircleMarker, useMap } from 'react-leaflet'
import { Button } from '@mui/material'
import MyLocationIcon from '@mui/icons-material/MyLocation';
import Leaflet from 'leaflet';
import Box from '@mui/material/Box';
import Control from 'react-leaflet-custom-control'
import ReactDOMServer from 'react-dom/server';


import Icon from "leaflet"

export const locationIconJSX = <MyLocationIcon sx={{color: "black", fontSize:22}} />
const svglocationIcon = ReactDOMServer.renderToString(locationIconJSX);


const locationIcon =L.divIcon({
    html: svglocationIcon,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
    className: "location-icon"
});


export function LocationMarker() {
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

    map.once('locationfound', function (e) {
      map.flyTo(e.latlng, map.getZoom());
    });
    updateLocation();

    const locationUpdateInterval = setInterval(updateLocation, 5000);

    return () => {
      clearInterval(locationUpdateInterval);
    };
  }, [map]);

  if (!position) {
    return null;
  }

  const { lat, lng } = position;
  const radius = position.accuracy / 2 || 0;



  return (
    <>
      <CircleMarker center={[lat, lng]} radius={radius}>
      </CircleMarker>
      <Marker position={position} icon={locationIcon}></Marker>
    </>
  );
}

export function LocationControl() {
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
        <Box sx={{ boxShadow: 1.3, border: 0.1, color: "black", padding: 0.5, background: "white" }}>
          {locationIconJSX}
        </Box>
      </Button>
    </Control>
  );
}
