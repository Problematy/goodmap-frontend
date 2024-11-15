import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup, useMap } from 'react-leaflet';
import { isMobile } from 'react-device-detect';
import { httpService } from '../../services/http/httpService';
import styled from 'styled-components';

import { LocationDetails } from './LocationDetails';
import { MobilePopup } from './MobilePopup';

const StyledMarkerPopup = styled(Popup)`
    min-width: 300px;
`;

const LocationDetailsWrapper = ({ theplace }) => {
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
    return <LocationDetails place={place} />;
};

const DesktopMarker = ({ place, isVisible }) => {
    return (
        <StyledMarkerPopup autoClose={false} closeOnClick={false} autoPan={false}>
            {isVisible ? <LocationDetailsWrapper theplace={place} /> : null}
        </StyledMarkerPopup>
    );
};

const ChosenMarker = ({ place, isVisible }) => {
    if (isMobile) {
        return (
            <MobilePopup isOpen={isVisible} onCloseHandler={() => {}}>
                <LocationDetailsWrapper theplace={place} />
            </MobilePopup>
        );
    }
    return <DesktopMarker place={place} isVisible={isVisible} />;
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
            <ChosenMarker place={place} isVisible={isClicked} />
        </Marker>
    );
};

MarkerPopup.propTypes = {
    place: PropTypes.shape({
        position: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
};
