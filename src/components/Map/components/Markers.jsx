import React, { useState, useEffect } from 'react';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { httpService } from '../../../services/http/httpService';
import { MarkerPopup } from '../../MarkerPopup/MarkerPopup';
import { useCategories } from '../../Categories/CategoriesContext';
import { ClusterMarker } from '../../MarkerPopup/ClusterMarker';

const getMarkers = locations => {
    if (window.USE_SERVER_SIDE_CLUSTERING) {
        return locations.map(location => {
            if (location.type === 'cluster') {
                return <ClusterMarker cluster={location} key={location.cluster_uuid} />;
            }
            return <MarkerPopup place={location} key={location.uuid} />;
        });
    }
    return locations.map(location => <MarkerPopup place={location} key={location.uuid} />);
};

export const Markers = ({ setAreMarkersLoaded }) => {
    const { categories } = useCategories();
    const [markers, setMarkers] = useState([]);
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

    return markers;
};
