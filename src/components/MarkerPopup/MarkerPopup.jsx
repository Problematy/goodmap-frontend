import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup, useMap } from 'react-leaflet';
import { isMobile } from 'react-device-detect';
import { httpService } from '../../services/http/httpService';
import styled from 'styled-components';

import { MarkerContent } from './MarkerContent';
import { MobilePopup } from './MobilePopup';

const StyledMarkerPopup = styled(Popup)`
    min-width: 300px;
`;

const MarkerContentWrapper = ({ theplace }) => {
    const [place, setPlace] = useState(null);

    useEffect(() => {
        const fetchPlace = async () => {
            const fetchedPlace = await httpService.getLocation(theplace.UUID);
            setPlace(fetchedPlace);
        };
        fetchPlace();
    }, [theplace.UUID]);

    if (!place) {
        return <p>Loading...</p>;
    }
    return <MarkerContent place={place} key={theplace.UUID} />;
};

const MobileMarker = ({ place }) => {
    const [open, setOpen] = useState(false);
    const map = useMap();

    const handleClickOpen = () => {
        const offset = 0.003;
        const newLat = place.position[0] - offset;
        map.panTo([newLat, place.position[1]], { duration: 0.5 });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <MobilePopup isOpen={open} onCloseHandler={handleClose}>
            <MarkerContentWrapper theplace={place} isMobileVariable={true} />
        </MobilePopup>
    );
};

const DesktopMarker = ({ place }) => {

    return (
        <StyledMarkerPopup>
            <MarkerContentWrapper theplace={place} />
        </StyledMarkerPopup>
    );
};

const ChosenMarker = ({ place }) => {
    return isMobile ? <MobileMarker place={place} /> : <DesktopMarker place={place} />;
};

export const MarkerPopup = ({ place }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleMarkerClick = () => {
        setIsClicked(true);
    };

    return (
        <Marker
            position={place.position}
            eventHandlers={{ click: handleMarkerClick }}
        >
            {isClicked && <ChosenMarker place={place} />}
        </Marker>
    );
};

MarkerPopup.propTypes = {
    place: PropTypes.shape({
        position: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
};
