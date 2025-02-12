import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MapContainer } from 'react-leaflet';
import { MarkerPopup } from '../src/components/MarkerPopup/MarkerPopup';

const correctMarkerData = {
    title: 'Most Grunwaldzki',
    position: [51.1095, 17.0525],
    subtitle: 'big bridge',
    data: [
        ['length', 112.5],
        ['accessible_by', ['pedestrians', 'cars']],
        ['website', { type: 'hyperlink', value: 'https://www.google.com' }],
        [
            'websiteWithDisplayValue',
            {
                type: 'hyperlink',
                value: 'https://www.google.com',
                displayValue: 'testWebsite',
            },
        ],
        ['unknownDataType', { type: 'unknown', value: 'example value for unknown data type' }],
    ],
    metadata: {
        UUID: '21231',
    },
};

describe('MarkerPopup', () => {
    beforeEach(() => {
        render(
            <MapContainer
                center={[51.1095, 17.0525]}
                zoom={10}
                style={{ height: '100vh', width: '100%' }}
            >
                <MarkerPopup place={correctMarkerData} key={correctMarkerData.metadata.UUID} />
            </MapContainer>,
        );
    });
    it('should render marker without popup', () => {
        expect(document.querySelector('.leaflet-marker-icon')).toBeInTheDocument;
        expect(document.querySelector('.leaflet-popup')).not.toBeInTheDocument;
        expect(screen.queryByText(correctMarkerData.title)).not.toBeInTheDocument;
    });

    it('should render marker popup after click on marker', () => {
        const marker = document.querySelector('.leaflet-marker-icon');
        fireEvent.click(marker);
        expect(document.querySelector('.leaflet-popup')).toBeInTheDocument;
        expect(screen.queryByText(correctMarkerData.title)).toBeInTheDocument;
    });
});
