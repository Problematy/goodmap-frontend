import React, { useState } from 'react';
import Modal from 'react-modal';
import {
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
} from '@mui/material';
import axios from 'axios';
import Control from 'react-leaflet-custom-control';
import AddIcon from '@mui/icons-material/Add';
import { buttonStyle } from '../../../styles/buttonStyle';

export const SuggestNewPointButton = () => {
    const [showModal, setShowModal] = useState(false);
    const [issue, setIssue] = useState('');

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirm = async event => {
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
