import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tooltip } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import styled from 'styled-components';
import { useLocation } from '../context/LocationContext';

/**
 * Button component that toggles the accessibility table list view.
 * Positioned in the bottom-left corner of the map.
 * Uses shared location context so all location-dependent buttons stay in sync.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Callback function triggered when geolocation is available
 * @returns {React.ReactElement} Styled button for toggling list view
 */
const ListView = ({ onClick }) => {
    const { t } = useTranslation();
    const { locationGranted, requestGeolocation } = useLocation();

    const handleOnClick = e => {
        e.stopPropagation();
        requestGeolocation(onClick);
    };

    return (
        <Wrapper>
            <Tooltip
                title={!locationGranted ? t('locationServicesDisabled') : t('listView')}
                placement="right"
                arrow
                enterTouchDelay={0}
                leaveTouchDelay={1500}
            >
                <Button
                    id="listViewButton"
                    onClick={handleOnClick}
                    variant="contained"
                    sx={{
                        borderRadius: '8px',
                        padding: '10px 16px',
                        whiteSpace: 'nowrap',
                        fontSize: '14px',
                        backgroundColor: !locationGranted ? '#666' : (globalThis.SECONDARY_COLOR || 'black'),
                        opacity: !locationGranted ? 0.6 : 1,
                        filter: !locationGranted ? 'grayscale(100%)' : 'none',
                        '&:hover': {
                            backgroundColor: !locationGranted ? '#666' : '#1a3d4a',
                            transform: !locationGranted ? 'none' : 'scale(1.05)',
                        },
                        '&:active': {
                            transform: !locationGranted ? 'none' : 'scale(0.95)',
                        },
                    }}
                >
                    <ViewListIcon style={{ marginRight: 8, fontSize: 20 }} />
                    {t('listView')}
                </Button>
            </Tooltip>
        </Wrapper>
    );
};

/**
 * Styled wrapper container for the list view button.
 * Positioned absolutely in the bottom-left corner with high z-index.
 * Responsive width adjusts for mobile devices.
 */
const Wrapper = styled.div`
    position: absolute;
    bottom: 20px;
    left: 10px;
    z-index: 9999999;
`;

export default ListView;
