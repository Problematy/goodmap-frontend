import React, { useState } from 'react';
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, Snackbar, IconButton } from '@mui/material';
import { useMap } from 'react-leaflet';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import Control from 'react-leaflet-custom-control';
import axios from 'axios';
import { buttonStyle } from '../../../styles/buttonStyle';

export const SuggestNewPointButton = () => {
    const map = useMap();
    const [showModal, setShowModal] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [organization, setOrganization] = useState('');
    const [userPosition, setUserPosition] = useState(map.getCenter());

    const handleOpenModal = () => {
        if (!navigator.geolocation) {
            setSnackbarOpen(true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            () => setShowModal(true),
            () => setSnackbarOpen(true)
        );
    };

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            setSnackbarOpen(true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => setUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude }),
            () => setSnackbarOpen(true)
        );
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    const handlePhotoUpload = event => {
        setPhoto(event.target.files[0]);
    };

    const handleOrganizationChange = event => {
        setOrganization(event.target.value);
    };

    const handleConfirm = async event => {
        event.preventDefault();
        setShowModal(false);

        const formData = new FormData();
        formData.append('position', JSON.stringify(userPosition));
        formData.append('photo', photo);
        formData.append('organization', organization);

        try {
            await axios.post('/api/suggest-new-point', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            console.error('Error suggesting new point:', error);
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
                <DialogTitle>Suggest a New Point</DialogTitle>
                <form onSubmit={handleConfirm}>
                    <DialogContent>
                        <TextField
                            label="Your Position"
                            value={`${userPosition.lat}, ${userPosition.lng}`}
                            disabled
                            fullWidth
                            margin="dense"
                        />
                        <IconButton onClick={handleLocateMe}>
                            <RefreshIcon />
                        </IconButton>
                        <Button variant="contained" component="label">
                            <AddAPhotoIcon />
                            <input type="file" hidden onChange={handlePhotoUpload} />
                        </Button>
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="organization-label">Organization</InputLabel>
                            <Select
                                labelId="organization-label"
                                value={organization}
                                onChange={handleOrganizationChange}
                            >
                                <MenuItem value="pck">PCK</MenuItem>
                                <MenuItem value="fundacja_usmiech">Fundacja Usmiech</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                        <Button onClick={handleCloseModal} variant="outlined" color="secondary">
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="Please enable location services to suggest a new point."
            />
        </>
    );
};
