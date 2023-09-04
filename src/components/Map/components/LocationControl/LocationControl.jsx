import React from 'react';
import { useState, useEffect } from 'react';
import { Marker, Popup, Circle, useMap } from 'react-leaflet'
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

function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}


export function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [bbox, setBbox] = useState([]);

  const map = useMap();

  useEffect(() => {
    const updateLocation = () => {
      map.locate().on('locationfound', function (e) {
        setPosition(e.latlng);
        const radius = e.accuracy;
        const circle = L.circle(e.latlng, radius);
        circle.addTo(map);

        setBbox(e.bounds.toBBoxString().split(','));
        map.flyTo(e.latlng, map.getZoom());
      });
    };

    updateLocation();

    const locationUpdateInterval = setInterval(updateLocation, 5000);

    return () => {
      clearInterval(locationUpdateInterval);
    };
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={locationIcon}>
    </Marker>
  );
}

export function LocationControl ({ onClick }){
    return (
        <Control prepend position="bottomright" >
            <Button onClick={onClick}>
                <Box sx={{ boxShadow: 1.3, border: 0.1, color: "black", padding: 0.5, background: "white"}}>
                    {locationIconJSX}
                </Box>
            </Button>
        </Control>
    );
}
