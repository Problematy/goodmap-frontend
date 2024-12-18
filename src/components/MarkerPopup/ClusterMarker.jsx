import React from 'react';
import { Marker } from '@adamscybot/react-leaflet-component-marker';
import styled from 'styled-components';

export const ClusterMarker = ({ cluster }) => {
    const handleClusterClick = () => {};

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

const ClusterMarkerIcon = ({ cluster }) => {
    return (
        <ClusterMarkerContainer>
            <span>{cluster.cluster_count}</span>
        </ClusterMarkerContainer>
    );
};

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
