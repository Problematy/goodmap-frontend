import PropTypes from 'prop-types';
import React from 'react';
import { Marker } from '@adamscybot/react-leaflet-component-marker';
import styled from 'styled-components';
import { useMap } from 'react-leaflet';

/**
 * Marker component for displaying server-side clustered locations.
 * When clicked, zooms in by 5 levels to reveal individual markers within the cluster.
 * Displays the cluster count in a circular blue icon.
 *
 * @param {Object} props - Component props
 * @param {Object} props.cluster - Cluster data object
 * @param {number[]} props.cluster.position - Coordinates [latitude, longitude] of cluster center
 * @param {number} props.cluster.cluster_count - Number of markers in this cluster
 * @returns {React.ReactElement} Marker component with custom cluster icon
 */
export const ClusterMarker = ({ cluster }) => {
    const map = useMap();
    const handleClusterClick = () => {
        map.flyTo(cluster.position, map.getZoom() + 5);
    };

    return (
        <Marker
            position={cluster.position}
            eventHandlers={{
                click: handleClusterClick,
            }}
            icon={<ClusterMarkerIcon cluster={cluster} />}
        />
    );
};

/**
 * Icon component that renders the visual representation of a cluster.
 * Displays the cluster count inside a circular blue container.
 *
 * @param {Object} props - Component props
 * @param {Object} props.cluster - Cluster data object
 * @param {number} props.cluster.cluster_count - Number of markers in this cluster
 * @returns {React.ReactElement} Styled circular icon with cluster count
 */
const ClusterMarkerIcon = ({ cluster }) => {
    return (
        <ClusterMarkerContainer>
            <span>{cluster.cluster_count}</span>
        </ClusterMarkerContainer>
    );
};

/**
 * Styled container for the cluster marker icon.
 * Creates a circular blue container with centered white text.
 */
const ClusterMarkerContainer = styled.div`
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #007bff;
    color: white;
    border-radius: 50%;
`;

ClusterMarkerIcon.propTypes = {
    cluster: PropTypes.shape({
        cluster_count: PropTypes.number.isRequired,
    }).isRequired,
};

ClusterMarker.propTypes = {
    cluster: PropTypes.shape({
        position: PropTypes.arrayOf(PropTypes.number).isRequired,
        cluster_count: PropTypes.number.isRequired,
    }).isRequired,
};
