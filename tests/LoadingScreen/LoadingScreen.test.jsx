import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { LoadingScreen } from '../../src/components/LoadingScreen/LoadingScreen';

const imageSource = "https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-05-37_256.gif";

describe('LoadingScreen', () => {

    it('should render image provided in link', () => {
        window.LOADING_GIF = imageSource;
        render(<LoadingScreen />);
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', imageSource);
    });
});
