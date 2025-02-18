import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { CategoriesProvider } from '../../../src/components/Categories/CategoriesContext';
import { MapContainer } from 'react-leaflet';
import { Markers } from '../../../src/components/Map/components/Markers';
import { httpService } from '../../../src/services/http/httpService';

jest.mock('../../../src/services/http/httpService');

const locations = [
    {
        position: [51.1095, 17.0525],
        UUID: '21231',
    },
    {
        position: [51.10655, 17.0555],
        UUID: '21232',
    },
];

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

httpService.getLocations.mockResolvedValue(locations);

describe('Markers', () => {
    beforeEach(() => {
        window.USE_LAZY_LOADING = true;
        window.USE_SERVER_SIDE_CLUSTERING = false;
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(locations),
        });
        return act(() =>
            render(
                <CategoriesProvider>
                    <MapContainer
                        center={[51.1095, 17.0525]}
                        zoom={10}
                        maxZoom={40}
                        style={{ height: '100vh', width: '100%' }}
                    >
                        <Markers />
                    </MapContainer>
                </CategoriesProvider>,
            ),
        );
    });

    afterEach(() => {
        global.fetch.mockRestore();
    });

    it('should render 2 markers without popup', () => {
        waitFor(() => expect(screen.getAllByRole('button').toHaveLength(2)));
        expect(document.querySelector('.leaflet-popup')).not.toBeInTheDocument();
        expect(screen.queryByText(locationData.title)).not.toBeInTheDocument();
    });
    /*
    it('should render marker popup after click on marker', () => {
        const marker = document.querySelector('.leaflet-marker-icon');
        fireEvent.click(marker);
        waitFor(() => {
            expect(document.querySelector('.leaflet-popup')).toBeInTheDocument();
            expect(screen.queryByText(locationData.title)).toBeInTheDocument();
        });
    });
    */
});
