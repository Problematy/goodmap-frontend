import React from 'react';
import { render, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MapComponent } from '../../src/components/Map/MapComponent';
import { CategoriesProvider } from '../../src/components/Categories/CategoriesContext';
import { httpService } from '../../src/services/http/httpService';

jest.mock('../../src/services/http/httpService');

const categories = [
    [
        ['types', 'typy'],
        [
            ['clothes', 'ciuchy'],
            ['shoes', 'buty'],
        ],
    ],
];

const locations = [
    {
        uuid: '1',
        name: 'name',
        position: [50, 50],
    },
];

httpService.getLocations.mockResolvedValue(locations);
httpService.getCategoriesData.mockResolvedValue(categories);

describe('MapComponent', () => {
    beforeAll(() => {
        global.window.FEATURE_FLAGS = {
            SHOW_SUGGEST_NEW_POINT_BUTTON: true,
            USE_SERVER_SIDE_CLUSTERING: false,
            SHOW_ACCESSIBILITY_TABLE: true,
            SHOW_SEARCH_BAR: true,
        };
    });

    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(categories),
        });
        return act(() =>
            render(
                <CategoriesProvider>
                    <MapComponent />
                </CategoriesProvider>,
            ),
        );
    });

    it('renders without crashing', () => {
        expect(screen.getAllByRole('presentation').length).toBeGreaterThan(0);
    });
});
