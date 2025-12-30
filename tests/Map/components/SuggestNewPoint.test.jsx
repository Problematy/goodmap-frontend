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
    globalThis.LOCATION_SCHEMA = {
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
        metaTag.remove();
    }
    delete globalThis.LOCATION_SCHEMA;
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

    it('handles file dialog cancellation without crashing', () => {
        globalThis.navigator.geolocation = {
            getCurrentPosition: jest.fn(success =>
                success({ coords: { latitude: 0, longitude: 0 } }),
            ),
        };

        render(<SuggestNewPointButton />);
        clickSuggestionsButton();

        return waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        }).then(() => {
            // Simulate user canceling file dialog (no file selected)
            const fileInput = screen.getByTestId('photo-of-point');
            fireEvent.change(fileInput, {
                target: { files: [] },
            });

            // Should not crash and no error message should be displayed
            expect(screen.queryByText(/too large/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
        });
    });

    it('displays validation error when required fields are empty', () => {
        axios.post.mockResolvedValue({});

        globalThis.navigator.geolocation = {
            getCurrentPosition: jest.fn(success =>
                success({ coords: { latitude: 0, longitude: 0 } }),
            ),
        };

        render(<SuggestNewPointButton />);

        clickSuggestionsButton();

        return waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        }).then(() => {
            // Try to submit without filling required fields
            fireEvent.click(screen.getByRole('button', { name: /submit/i }));

            return waitFor(() => {
                // Should show validation error
                expect(screen.getByText(/Please fill in required fields/i)).toBeInTheDocument();
                // Dialog should still be open
                expect(screen.getByRole('dialog')).toBeInTheDocument();
                // Should NOT have called axios.post
                expect(axios.post).not.toHaveBeenCalled();
            });
        });
    });
});
