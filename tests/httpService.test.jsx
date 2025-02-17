import { waitFor } from '@testing-library/react';
import { httpService } from '../src/services/http/httpService';

jest.mock('../src/services/http/httpService');

const location = {
    position: [51.1095, 17.0525],
    name: 'name',
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
/*
const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue(locationData),
});
*/

describe('httpService', () => {
    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(locationData),
        });
    });

    afterEach(() => {
        global.fetch.mockRestore();
    });

    it('should fetch location', () => {
        waitFor(() => {
            const json = httpService.getLocation(location.uuid);
            // expect(fetchMock).toHaveBeenCalled
            expect(json.data.length).toEqual(5);
        });
    });
});
