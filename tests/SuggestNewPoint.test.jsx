import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SuggestNewPointButton } from '../src/components/Map/components/SuggestNewPointButton';
import React from 'react';
//
// describe('SuggestNewPointButton', () => {
//     it('should show dialog when button is clicked and geolocation is enabled', async () => {
//         global.navigator = {
//             getCurrentPosition: jest.fn().mockImplementation(success => success()),
//             geolocation: 123,
//         };
//         render(<SuggestNewPointButton />);
//         fireEvent.click(screen.getByRole('button'));
//
//         await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
//     });
//     it('should show dialog when button is clicked and geolocation is enabled', async () => {
//         global.navigator = {
//             getCurrentPosition: jest.fn().mockImplementation(success => success()),
//             geolocation: 123,
//         };
//         render(<SuggestNewPointButton />);
//         fireEvent.click(screen.getByRole('button'));
//
//         await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
//     });
// //

jest.mock('axios');

const clickSuggestionsButton = () => {
    fireEvent.click(screen.getByTestId('suggest-new-point'));
};

describe('SuggestNewPointButton', () => {
    it('displays error message when geolocation is not supported', async () => {
        global.navigator.geolocation = undefined;

        render(<SuggestNewPointButton />);
        clickSuggestionsButton();

        await waitFor(() => {
            expect(screen.getByText('Please enable location services to suggest a new point.')).toBeInTheDocument();
        });
    });

    it('displays error message when location services are not enabled', async () => {
        global.navigator.geolocation = {
            getCurrentPosition: jest.fn((success, error) => error()),
        };

        render(<SuggestNewPointButton />);

        clickSuggestionsButton();

        await waitFor(() => {
            expect(screen.getByText('Please enable location services to suggest a new point.')).toBeInTheDocument();
        });
    });
//
//     it('opens new point suggestion box when location services are enabled', async () => {
//         global.navigator.geolocation = {
//             getCurrentPosition: jest.fn((success) => success({ coords: { latitude: 0, longitude: 0 } })),
//         };
//
//         render(<SuggestNewPointButton />);
//
//         clickSuggestionsButton();
//
//         await waitFor(() => {
//             expect(screen.getByRole('dialog')).toBeInTheDocument();
//         });
//     });
//
//     it('displays error message when selected file is too large', async () => {
//         global.navigator.geolocation = {
//             getCurrentPosition: jest.fn((success) => success({ coords: { latitude: 0, longitude: 0 } })),
//         };
//
//         render(<SuggestNewPointButton />);
//
//         clickSuggestionsButton();
//
//         await waitFor(() => {
//             fireEvent.change(screen.getByLabelText(/add a photo icon/i), {
//                 target: { files: [new File([''], 'photo.jpg', { size: 6000000 })] },
//             });
//         });
//
//         await waitFor(() => {
//             expect(screen.getByText('The selected file is too large. Please select a file smaller than 5MB.')).toBeInTheDocument();
//         });
//     });
//
//     it('submits new point suggestion when form is filled correctly', async () => {
//         const axios = require('axios');
//         axios.post.mockResolvedValue({});
//
//         global.navigator.geolocation = {
//             getCurrentPosition: jest.fn((success) => success({ coords: { latitude: 0, longitude: 0 } })),
//         };
//
//         render(<SuggestNewPointButton />);
//
//         clickSuggestionsButton();
//
//         await waitFor(() => {
//             fireEvent.change(screen.getByLabelText(/add a photo icon/i), {
//                 target: { files: [new File([''], 'photo.jpg', { size: 4000000 })] },
//             });
//             fireEvent.change(screen.getByLabelText(/organization/i), { target: { value: 'org-1' } });
//             fireEvent.click(screen.getByRole('button', { name: /submit/i }));
//         });
//
//         await waitFor(() => {
//             expect(axios.post).toHaveBeenCalledWith('/api/suggest-new-point', expect.any(FormData), {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//         });
//     });
});
