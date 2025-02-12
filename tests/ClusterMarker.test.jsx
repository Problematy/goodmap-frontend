import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MapContainer } from 'react-leaflet';
import { ClusterMarker } from '../src/components/MarkerPopup/ClusterMarker';

const correctClusterData = {
    position: [51.1095, 17.0525],
    cluster_count: 5, // eslint-disable-line camelcase
};

describe('ClusterMarker', () => {
    beforeEach(() => {
        render(
            <MapContainer
                center={[51.1095, 17.0525]}
                zoom={10}
                style={{ height: '100vh', width: '100%' }}
            >
                <ClusterMarker cluster={correctClusterData} />
            </MapContainer>,
        );
    });

    it('should render cluster count', () => {
        const cluster = document.querySelector('.marker-cluster');
        expect(cluster).toBeInTheDocument;
        expect(screen.getByText(correctClusterData.cluster_count)).toBeInTheDocument;
    });

    it('should render markers after click on cluster', () => {
        const cluster = document.querySelector('.leaflet-marker-icon');
        const clusterCount = screen.getByText(correctClusterData.cluster_count); // eslint-disable-line camelcase
        expect(clusterCount).toBeInTheDocument;
        fireEvent.click(cluster);
        expect(clusterCount).not.toBeInTheDocument;
        expect(document.querySelector('.marker-cluster')).not.toBeInTheDocument;
    });
});
