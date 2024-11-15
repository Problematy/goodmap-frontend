import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup, useMap } from 'react-leaflet';
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

const DesktopPopup = ({ place }) => (
    <StyledMarkerPopup>
        <LocationDetailsBoxWrapper theplace={place} />
    </StyledMarkerPopup>
);

const ChosenPopup = ({ place }) => {
    if (isMobile) {
        return (
            <MobilePopup onCloseHandler={() => {}}>
                <LocationDetailsBoxWrapper theplace={place} />
            </MobilePopup>
        );
    }
    return <DesktopPopup place={place} />;
};

export const MarkerPopup = ({ place }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleMarkerClick = () => {
        setIsClicked(true);
    };

    return (
        <Marker
            position={place.position}
            eventHandlers={{
                click: handleMarkerClick,
            }}
        >
            {isClicked && (
                <>
                    {isMobile ? (
                        <MobilePopup onCloseHandler={() => setIsClicked(false)}>
                            <LocationDetailsBoxWrapper theplace={place} />
                        </MobilePopup>
                    ) : (
                        <Popup onClose={() => setIsClicked(false)}>
                            <LocationDetailsBoxWrapper theplace={place} />
                        </Popup>
                    )}
                </>
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
