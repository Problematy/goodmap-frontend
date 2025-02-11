import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MapContainer } from 'react-leaflet';
import { ClusterMarker } from '../src/components/MarkerPopup/ClusterMarker';

const correctClusterData = {
    position: [51.1095, 17.0525],
    cluster_count: 5,
};

describe('ClusterMarker', () => {
    it('should render cluster count', () => {
        render(
            <MapContainer
                center={[51.1095, 17.0525]}
                zoom={10}
                style={{ height: '100vh', width: '100%' }}
            >
                <ClusterMarker cluster={correctClusterData} />
            </MapContainer>,
        );

        //const cluster = screen.getByTestId('cluster');
        expect(screen.getByText(correctClusterData.cluster_count)).toBeInTheDocument();
        //fireEvent.click(cluster);
        //expect(screen.getByText(correctClusterData.cluster_count)).not.toBeInTheDocument();
    });
});
