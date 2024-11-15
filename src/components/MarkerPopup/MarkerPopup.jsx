import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import { isMobile } from 'react-device-detect';
import { httpService } from '../../services/http/httpService';
import styled from 'styled-components';

import { LocationDetailsBox } from './LocationDetails';
import { MobilePopup } from './MobilePopup';

const StyledMarkerPopup = styled(Popup)`
    min-width: 300px;
`;

const LocationDetailsBoxWrapper = ({ theplace }) => {
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
    return <LocationDetailsBox place={place} />;
};

export const MarkerPopup = ({ place }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleMarkerClick = () => {
        setIsClicked(true);
    };

    const handleClosePopup = () => {
        setIsClicked(false);
    };

    return (
        <Marker
            position={place.position}
            eventHandlers={{
                click: handleMarkerClick,
            }}
        >
            {!isMobile && isClicked && (
                <StyledMarkerPopup
                    onClose={handleClosePopup}
                    autoClose={false} // Ensure it doesn't auto-close when re-rendering
                    closeOnClick={false}
                    open={isClicked} // Controls visibility
                >
                    <LocationDetailsBoxWrapper theplace={place} />
                </StyledMarkerPopup>
            )}
            {isMobile && isClicked && (
                <MobilePopup onCloseHandler={handleClosePopup}>
                    <LocationDetailsBoxWrapper theplace={place} />
                </MobilePopup>
            )}
        </Marker>
    );
};

MarkerPopup.propTypes = {
    place: PropTypes.shape({
        position: PropTypes.arrayOf(PropTypes.number).isRequired,
        UUID: PropTypes.string.isRequired,
    }).isRequired,
};
