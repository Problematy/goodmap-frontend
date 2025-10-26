import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { httpService } from '../../../services/http/httpService';
import { MarkerPopup } from '../../MarkerPopup/MarkerPopup';
import { useCategories } from '../../Categories/CategoriesContext';
import { ClusterMarker } from '../../MarkerPopup/ClusterMarker';

/**
 * Converts location data into marker components.
 * Supports both server-side clustering (ClusterMarker) and client-side clustering (MarkerPopup).
 * Behavior is controlled by window.FEATURE_FLAGS?.USE_SERVER_SIDE_CLUSTERING.
 *
 * @param {Array<Object>} locations - Array of location objects to render as markers
 * @returns {Array<React.ReactElement>} Array of marker components
 */
const getMarkers = locations => {
    if (window.FEATURE_FLAGS?.USE_SERVER_SIDE_CLUSTERING) {
        return locations.map(location => {
            if (location.type === 'cluster') {
                return <ClusterMarker cluster={location} key={location.cluster_uuid} />;
            }
            return <MarkerPopup place={location} key={location.uuid} />;
        });
    }
    return locations.map(location => <MarkerPopup place={location} key={location.uuid} />);
};

/**
 * Component that fetches and renders map markers based on selected category filters.
 * Wraps markers in a MarkerClusterGroup for automatic clustering of nearby markers.
 * Changes the map cursor to 'progress' while markers are loading.
 * Re-fetches markers whenever the selected categories change.
 *
 * @returns {React.ReactElement|Array} MarkerClusterGroup containing location markers, or empty array while loading
 */
export const Markers = () => {
    const { categories } = useCategories();
    const [markers, setMarkers] = useState([]);
    const [areMarkersLoaded, setAreMarkersLoaded] = useState(false);
    const map = useMap();
    useEffect(() => {
        setAreMarkersLoaded(false);

        const fetchMarkers = async () => {
            const locations = await httpService.getLocations(categories);

            const markersToAdd = getMarkers(locations);

            const markerCluster = (
                <MarkerClusterGroup
                    eventHandlers={{
                        add: () => {
                            setAreMarkersLoaded(true);
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
            setMarkers([]);
        };
    }, [categories]);

    useEffect(() => {
        const mapContainer = map.getContainer();
        const cursorStyle = areMarkersLoaded ? 'auto' : 'progress';
        mapContainer.style.cursor = cursorStyle;

        return () => {
            mapContainer.style.cursor = 'auto';
        };
    }, [areMarkersLoaded, map]);

    return markers;
};
