import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MapContainer } from 'react-leaflet';
import { MarkerPopup } from '../../src/components/MarkerPopup/MarkerPopup';
import { httpService } from '../../src/services/http/httpService';

jest.mock('../../src/services/http/httpService');

const location = {
    position: [51.1095, 17.0525],
    uuid: '21231',
};

const locationData = {
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

httpService.getLocation.mockResolvedValue(locationData);

describe('MarkerPopup', () => {
    beforeEach(() => {
        window.USE_LAZY_LOADING = true;
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(locationData),
        });
        return act(() =>
            render(
                <MapContainer
                    center={[51.1095, 17.0525]}
                    zoom={10}
                    style={{ height: '100vh', width: '100%' }}
                >
                    <MarkerPopup place={location} key={location.uuid} />
                </MapContainer>,
            ),
        );
    });

    afterEach(() => {
        global.fetch.mockRestore();
        delete window.USE_LAZY_LOADING;
    });

    it('should render marker without popup', () => {
        expect(document.querySelector('.leaflet-marker-icon')).toBeInTheDocument();
        expect(document.querySelector('.leaflet-popup')).not.toBeInTheDocument();
        expect(screen.queryByText(locationData.title)).not.toBeInTheDocument();
    });

    it('should render marker popup after click on marker', () => {
        const marker = document.querySelector('.leaflet-marker-icon');
        fireEvent.click(marker);
        waitFor(() => {
            expect(document.querySelector('.leaflet-popup')).toBeInTheDocument();
            expect(screen.queryByText(locationData.title)).toBeInTheDocument();
        });
    });
});
