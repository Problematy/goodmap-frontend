import React from 'react';

export const LoadingScreen = ({ className }) => {
    return (
        <div
            className={className}
            style={{
                zIndex: 99999999,
                backgroundColor: 'rgba(36, 84, 102, 0.4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <img src={window.LOADING_GIF} alt="Loading..." style={{ maxWidth: '30%' }} />
        </div>
    );
};
