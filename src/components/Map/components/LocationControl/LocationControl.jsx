import React from 'react';
import { useState, useEffect } from 'react';
import { Marker, Popup, Circle, useMap } from 'react-leaflet'
import { Button } from '@mui/material'
import MyLocationIcon from '@mui/icons-material/MyLocation';
import Leaflet from 'leaflet';
import Box from '@mui/material/Box';
import Control from 'react-leaflet-custom-control'

const LocationIcon = () => {
    return <MyLocationIcon sx={{color: "black", fontSize:22}} />
};

export const locationIcon = LocationIcon();

Leaflet.Control.Button = Leaflet.Control.extend({
    options: {
        position: 'bottomright',
    },

    onLocationFoundCallback: (coordinates, map) =>
        map.flyTo([coordinates.coords.latitude, coordinates.coords.longitude], 15),

    onAdd: function (map) {
        const container = Leaflet.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = Leaflet.DomUtil.create('a', 'leaflet-control-button', container);
        const locationIcon = LocationIcon();

        container.title = 'Twoja lokalizacja';
        button.appendChild(locationIcon);

        Leaflet.DomEvent.disableClickPropagation(button);
        Leaflet.DomEvent.on(button, 'click', () => {
            navigator.geolocation.getCurrentPosition(coordinates =>
                this.onLocationFoundCallback(coordinates, map),
            );
        });

        return container;
    },

    onRemove: function () {},
});



export function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [positionAccuracy, setPositionAccuracy] = useState(null);
  const map = useMap();

  const startTrackingLocation = () => {
    const watchId = map.locate({ watch: true }).on('locationfound', handleLocationFound);
    return () => {
      map.stopLocate();
      watchId();
    };
  };

  const handleLocationFound = (e) => {
    setPosition(e.latlng);
    setPositionAccuracy(e.accuracy);
    map.flyTo(e.latlng, map.getZoom());
  };

  useEffect(() => {
    const cleanup = startTrackingLocation();
    return cleanup;
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={locationIcon}>
      <Popup>You are here</Popup>
      <Circle center={position} radius={positionAccuracy / 10} />
    </Marker>
  );
}

export function LocationControl ({ onClick }){
    return (
        <Control prepend position="bottomright" >
            <Button onClick={onClick}>
                <Box sx={{ boxShadow: 1.3, border: 0.1, color: "black", padding: 0.5, background: "white"}}>
                    <MyLocationIcon sx={{color: "black", fontSize:22}} />
                </Box>
            </Button>
        </Control>
    );
}
