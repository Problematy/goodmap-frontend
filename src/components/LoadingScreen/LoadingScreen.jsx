import React from 'react';

export const LoadingScreen = ({ className }) => {
    return (
        <div
            className={className}
            style={{
                zIndex: 99999999,
                backgroundColor: 'rgba(50, 50, 50, 0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <img src={window.LOADING_GIF} alt="Loading..." style={{ maxWidth: '30%' }} />
        </div>
    );
};
