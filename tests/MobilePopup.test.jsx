import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MapContainer } from 'react-leaflet';
import { MobilePopup } from '../src/components/MarkerPopup/MobilePopup';

describe('should render marker popup correctly', () => {
    beforeEach(() => {
        render(
            <MapContainer center={[51.1095, 17.0525]}>
                <MobilePopup />
            </MapContainer>,
        );
    });

    it('should have a close button', () => {
        expect(document.querySelector('button[aria-label="close"]')).toBeInTheDocument();
    });
});
