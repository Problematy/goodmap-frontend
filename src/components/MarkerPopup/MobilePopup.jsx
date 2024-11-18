import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const MobilePopup = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMarker, setCurrentMarker] = useState(null);
    const map = useMap();

    const closePopup = () => {
        setIsOpen(false);
        setCurrentMarker(null);
    };

    useEffect(() => {
        const handleMarkerClick = (e) => {
            setIsOpen(true);
            setCurrentMarker(e.target); // Przechowuje kliknięty marker
        };

        // Dodajemy zdarzenie kliknięcia do wszystkich markerów
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                layer.on('click', handleMarkerClick);
            }
        });

        // Czyszczenie zdarzeń przy odmontowaniu
        return () => {
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    layer.off('click', handleMarkerClick);
                }
            });
        };
    }, [map]);

    return (
        <Dialog
            open={isOpen}
            onClose={closePopup}
            fullWidth
            maxWidth="md"
            style={{
                position: 'fixed',
                bottom: 0,
                margin: 0,
            }}
            PaperProps={{
                style: {
                    position: 'fixed',
                    bottom: 0,
                    margin: 0,
                    width: '100%',
                    maxHeight: '50%',
                },
            }}
        >
            <DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={closePopup}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {currentMarker && children}
            </DialogContent>
        </Dialog>
    );
};
