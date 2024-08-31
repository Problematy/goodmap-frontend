import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, Box, TextField } from '@mui/material';
import axios from 'axios';
import Control from 'react-leaflet-custom-control';

const buttonStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '100%',
    backgroundColor: '#3d91e5',
    color: 'white',
    fontSize: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    border: 'none',
};

const SuggestNewPointButtonRaw = () => {
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
            <Button onClick={handleOpenModal} style={buttonStyle}>+</Button>
            <Modal isOpen={showModal}>
                <form onSubmit={handleConfirm}>
                    <TextField
                        label="Issue"
                        value={issue}
                        onChange={event => setIssue(event.target.value)}
                        required
                    />
                    <button type="submit">Confirm</button>
                    <button type="button" onClick={handleCloseModal}>Cancel</button>
                </form>
            </Modal>
        </>
    );
};

export const SuggestNewPointButton = () => {
    return (
        <>
                    <Control prepend position="bottomright">
                        <SuggestNewPointButtonRaw />
        </Control>
        </>
    );
};
