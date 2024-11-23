import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useCategories } from '../../Categories/CategoriesContext';
import { httpService } from '../../../services/http/httpService';
import { MarkerPopup } from '../../MarkerPopup/MarkerPopup';


export const Markers = () => {
    const [markers, setMarkers] = useState([]);
    const [areMarkersLoaded, setAreMarkersLoaded] = useState(false);
    const { categories } = useCategories();
    const map = useMap();

    useEffect(() => {
        setAreMarkersLoaded(false); // Resetuj stan ładowania

        const fetchMarkers = async () => {
            const query = Object.entries(categories)
                .map(([key, values]) => values.map(value => `${key}=${value}`).join('&'))
                .join('&');

            const marks = await httpService.getLocations(query);

            // Utwórz markery i śledź ich dodanie
            const markersToAdd = marks.map(location => (
                <MarkerPopup place={location} key={location.UUID} />
            ));

            const markerCluster = (
                <MarkerClusterGroup
                    eventHandlers={{
                        add: () => {
                            console.log('Cluster added to the map');
                            setAreMarkersLoaded(true); // Markery są na mapie
                        },
                    }}
                >
                    {markersToAdd}
                </MarkerClusterGroup>
            );

            setMarkers(markerCluster);
        };

        fetchMarkers();

        return () => {
            setMarkers([]); // Czyść markery przy unmount
        };
    }, [categories]);

    // Zmieniaj kursor na mapie w zależności od stanu
    useEffect(() => {
        const cursorStyle = areMarkersLoaded ? 'auto' : 'progress';
        map.getContainer().style.cursor = cursorStyle;
    }, [areMarkersLoaded, map]);

    return markers;
};
