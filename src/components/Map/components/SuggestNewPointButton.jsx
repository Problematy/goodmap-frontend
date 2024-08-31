import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Control from 'react-leaflet-custom-control';
import { Button, Box } from '@mui/material';

const buttonStyle = {
    alignItems: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3d91e5',
    color: '#ffffff',
    fontSize: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    border: 'none',
};

export const SuggestNewPointButton = () => {
    const [location, setLocation] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [stream, setStream] = useState(null);

    const getGeolocation = () => {
        const { navigator } = window;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                error => {
                    console.log('err', error);
                },
            );
        } else {
            alert('Geolocation is not supported by this browser');
        }
    };

    const getMediaAccess = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            const newPhoto = document.createElement('img');
            newPhoto.src = URL.createObjectURL(mediaStream);
            setPhoto(newPhoto);
            setShowModal(true);
        } catch (error) {
            console.log('Error accessing media devices.', error);
        }
    };

    const handleClick = () => {
        getGeolocation();
        getMediaAccess();
    };

    const handleConfirm = () => {
        setShowModal(false);
    };

    const handleCancel = () => setShowModal(false);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    return (
        <>
            <Control prepend position="bottomright">
                <Button onClick={handleClick}>
                    <Box sx={buttonStyle}>
                        <Modal isOpen={showModal}>
                            <div>
                                <p>Your location: {location ? `Latitude: ${location.latitude}, Longitude: ${location.longitude}` : 'Location not available'}</p>
                                {photo && <img src={photo.src} />}
                            </div>
                            <button onClick={handleConfirm}>Confirm</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </Modal>
                    </Box>
                </Button>
            </Control>
        </>
    );
};
