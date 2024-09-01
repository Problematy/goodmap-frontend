import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
import axios from 'axios';
import Control from 'react-leaflet-custom-control';
import AddIcon from '@mui/icons-material/Add'; // Import ikony dla przycisku dodawania punktu

const buttonStyle = {
    width: '50px',
    height: '50px',
    minWidth: '50px',
    borderRadius: '50%',
    backgroundColor: '#3d91e5',
    color: 'white',
    fontSize: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    lineHeight: '1',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
};

// Komponent dla przycisku dodawania nowego punktu
export const SuggestNewPointButton = () => {
    const [showModal, setShowModal] = useState(false);
    const [issue, setIssue] = useState('');

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirm = async (event) => {
        event.preventDefault();
        setShowModal(false);
        try {
            await axios.post('/api/report-issue', { issue });
        } catch (error) {
            console.error('Error reporting issue:', error);
        }
    };

    return (
        <>
            <Control prepend position="bottomright">
                <Button onClick={handleOpenModal} style={buttonStyle} variant="contained">
                    <AddIcon style={{ color: 'white', fontSize: 24 }} />
                </Button>
            </Control>
            <Dialog open={showModal} onClose={handleCloseModal}>
                <DialogTitle>Report an Issue</DialogTitle>
                <form onSubmit={handleConfirm}>
                    <DialogContent>
                        <TextField
                            label="Issue"
                            value={issue}
                            onChange={event => setIssue(event.target.value)}
                            required
                            fullWidth
                            margin="dense"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" variant="contained" color="primary">
                            Confirm
                        </Button>
                        <Button onClick={handleCloseModal} variant="outlined" color="secondary">
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};
