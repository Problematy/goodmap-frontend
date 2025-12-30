import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import axios from 'axios';
import { SuggestNewPointButton } from '../../../src/components/Map/components/SuggestNewPointButton';

jest.mock('axios');

// Mock CSRF token meta tag and location schema
beforeEach(() => {
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'csrf-token');
    metaTag.setAttribute('content', 'test-csrf-token');
    document.head.appendChild(metaTag);

    // Mock location schema
    window.LOCATION_SCHEMA = {
        obligatory_fields: [
            ['name', 'str'],
            ['accessible_by', 'list'],
            ['type_of_place', 'str'],
        ],
        categories: {
            accessible_by: ['bikes', 'cars', 'pedestrians'],
            type_of_place: ['big bridge', 'small bridge'],
        },
    };
});

afterEach(() => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        document.head.removeChild(metaTag);
    }
    delete window.LOCATION_SCHEMA;
});

const clickSuggestionsButton = () => {
    fireEvent.click(screen.getByTestId('suggest-new-point'));
};

const mockUploadingFileWithSizeInMB = sizeInMB => {
    const largeFile = {
        name: 'large-file.txt',
        size: sizeInMB * 1024 * 1024,
        type: 'text/plain',
    };

    fireEvent.change(screen.getByTestId('photo-of-point'), {
        target: { files: [largeFile] },
    });
};

describe('SuggestNewPointButton', () => {
    it('displays error message when geolocation is not supported', () => {
        globalThis.navigator.geolocation = undefined;

        render(<SuggestNewPointButton />);
        clickSuggestionsButton();

        return waitFor(() => {
            expect(
                screen.getByText('Please enable location services to suggest a new point.'),
            ).toBeInTheDocument();
        });
    });

    it('displays error message when location services are not enabled', () => {
        globalThis.navigator.geolocation = {
            getCurrentPosition: jest.fn((success, error) => error()),
        };

        render(<SuggestNewPointButton />);

        clickSuggestionsButton();

        return waitFor(() => {
            expect(
                screen.getByText('Please enable location services to suggest a new point.'),
            ).toBeInTheDocument();
        });
    });

    it('opens new point suggestion box when location services are enabled', () => {
        globalThis.navigator.geolocation = {
            getCurrentPosition: jest.fn(success =>
                success({ coords: { latitude: 0, longitude: 0 } }),
            ),
        };

        render(<SuggestNewPointButton />);

        clickSuggestionsButton();

        return waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    it('displays error message when selected file is too large', () => {
        globalThis.navigator.geolocation = {
            getCurrentPosition: jest.fn(success =>
                success({ coords: { latitude: 0, longitude: 0 } }),
            ),
        };

        render(<SuggestNewPointButton />);
        URL.createObjectURL = jest.fn(() => 'blob:http://test-url/');
        clickSuggestionsButton();

        return waitFor(() => {
            mockUploadingFileWithSizeInMB(6);
        }).then(() =>
            waitFor(() => {
                expect(
                    screen.getByText(
                        'The selected file is too large. Please select a file smaller than 5MB.',
                    ),
                ).toBeInTheDocument();
            }),
        );
    });

    it('handles file dialog cancellation without crashing', async () => {
        globalThis.navigator.geolocation = {
            getCurrentPosition: jest.fn(success =>
                success({ coords: { latitude: 0, longitude: 0 } }),
            ),
        };

        render(<SuggestNewPointButton />);
        clickSuggestionsButton();

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        // Simulate user canceling file dialog (no file selected)
        const fileInput = screen.getByTestId('photo-of-point');
        fireEvent.change(fileInput, {
            target: { files: [] },
        });

        // Should not crash and no error message should be displayed
        expect(screen.queryByText(/too large/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    it('submits new point suggestion when form is filled correctly', async () => {
        axios.post.mockResolvedValue({});

        globalThis.navigator.geolocation = {
            getCurrentPosition: jest.fn(success =>
                success({ coords: { latitude: 0, longitude: 0 } }),
            ),
        };

        render(<SuggestNewPointButton />);

        clickSuggestionsButton();

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        // Fill in the name field
        const nameInput = screen.getByTestId('name-input');
        fireEvent.change(nameInput, { target: { value: 'Test Bridge' } });

        // Select type_of_place
        const typeSelect = screen.getByTestId('type_of_place-select');
        fireEvent.mouseDown(typeSelect);
        await waitFor(() => {
            const option = screen.getByText('big bridge');
            fireEvent.click(option);
        });

        // Upload a photo
        mockUploadingFileWithSizeInMB(4);

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                '/api/suggest-new-point',
                expect.any(FormData),
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': 'test-csrf-token',
                    },
                },
            );
        });
    });
});
