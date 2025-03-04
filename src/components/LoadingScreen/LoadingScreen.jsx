import React from 'react';
import styled from 'styled-components';

export const LoadingScreen = () => {
    return (
        <LoadingBackground>
            <img
                //src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-05-37_256.gif"
                src={window.LOADING_GIF}
                alt="Loading..."
            />
        </LoadingBackground>
    );
};

const LoadingBackground = styled.div`
    z-index: 99999999;
    position: absolute;
    width: inherit;
    height: inherit;
    background-color: rgba(50, 50, 50, 0.7);

    display: flex;
    justify-content: center;
    align-items: center;
`;
