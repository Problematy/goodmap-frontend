import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup, useMap } from 'react-leaflet';
import ExploreIcon from '@mui/icons-material/Explore';
import { isMobile } from 'react-device-detect';
import { getContentAsString, mapCustomTypeToReactComponent } from './mapCustomTypeToReactComponent';
import { buttonStyleSmall } from '../../styles/buttonStyle';
import { ReportProblemForm } from './ReportProblemForm';
import { useTranslation } from 'react-i18next';

import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const isCustomValue = value => typeof value === 'object' && !(value instanceof Array);

const PopupValue = ({ valueToDisplay }) => {
    const value = isCustomValue(valueToDisplay)
        ? mapCustomTypeToReactComponent(valueToDisplay)
        : valueToDisplay;
    return (
        <p className="m-0">
            <b>{getContentAsString(value)}</b>
        </p>
    );
};

PopupValue.propTypes = {
    valueToDisplay: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array,
        PropTypes.element,
    ]).isRequired,
};

const NavigateMeButton = ({ place }) => (
    <a
        href={`geo:${place.position[0]},${place.position[1]}?q=${place.position[0]},${place.position[1]}`}
        style={{ textDecoration: 'none' }}
    >
        <p
            style={{
                ...buttonStyleSmall,
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <ExploreIcon style={{ color: 'white', marginRight: '10px' }} />
            <span>Navigate me</span>
        </p>
    </a>
);

export const MarkerContent = ({ place }) => {
    const { t } = useTranslation();
    const categoriesWithSubcategories = place.data.filter(([category]) => !(category === 'CTA'));
    const CTACategories = place.data.filter(([category]) => category === 'CTA');
    const [showForm, setShowForm] = useState(false);
    const toggleForm = () => setShowForm(!showForm);
    console.log(isMobile);
    return (
        <>
            <div className="place-data m-0">
                <div style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                    <p className="point-title m-0" style={{ fontSize: 14, fontWeight: 'bold' }}>
                        <b>{place.title}</b>
                    </p>
                </div>
                <div style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                    <p className="point-subtitle mt-0 mb-2" style={{ fontSize: 10 }}>
                        {place.subtitle}
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '100px 1fr',
                        columnGap: '10px',
                        rowGap: '5px',
                        margin: '10px 25px',
                        alignItems: 'start',
                        fontSize: 12,
                    }}
                >
                    {categoriesWithSubcategories.map(([category, value]) => (
                        <>
                            <p key={`${category}-label`} className="m-0" style={{ margin: 0 }}>
                                {`${category}:`}
                            </p>
                            <div
                                key={`${category}-value`}
                                style={{
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-word',
                                    maxWidth: '100%',
                                }}
                            >
                                <PopupValue valueToDisplay={value} />
                            </div>
                        </>
                    ))}
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginRight: 25,
                        marginLeft: 25,
                        marginTop: 10,
                    }}
                >
                    {CTACategories.map(([_category, value]) => (
                        <PopupValue key={value} valueToDisplay={value} />
                    ))}
                </div>
            </div>
            {isMobile && <NavigateMeButton place={place} />}

            <p onClick={toggleForm} style={{ cursor: 'pointer', textAlign: 'right', color: 'red' }}>
                {t('ReportIssueButton')}
            </p>
            {showForm && <ReportProblemForm placeId={place.metadata.UUID} />}
        </>
    );
};

// export const MarkerPopup = ({ place }) => (
//     <Marker position={place.position} key={place.metadata.UUID}>
//         <Popup>
//             <MarkerContent place={place} />
//         </Popup>
//     </Marker>
// );

export const MarkerPopup = ({ place }) => {
    const [open, setOpen] = useState(false);
    const map = useMap();

    const handleClickOpen = () => {
        if (isMobile) {
            const offset = 0.003;
            const newLat = place.position[0] - offset;
            map.panTo([newLat, place.position[1]], { duration: 0.5 });
            console.log('clicked');
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Marker
                position={place.position}
                key={place.metadata.UUID}
                eventHandlers={{ click: handleClickOpen }}
            >
                {!isMobile && (
                    <Popup>
                        <MarkerContent place={place} />
                    </Popup>
                )}
            </Marker>

            {isMobile && (
                <Dialog
                    open={open}
                    onClose={handleClose}
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
                            onClick={handleClose}
                            style={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <MarkerContent place={place} />
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

MarkerPopup.propTypes = {
    place: PropTypes.shape({
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired,
        data: PropTypes.shape({}).isRequired,
    }).isRequired,
};
