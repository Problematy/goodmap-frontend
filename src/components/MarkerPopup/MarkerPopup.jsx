import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Marker, useMap } from 'react-leaflet';
import { isMobile } from 'react-device-detect';
import { httpService } from '../../services/http/httpService';
import styled from 'styled-components';
import L from 'leaflet';

import { LocationDetailsBox } from './LocationDetails';
import { MobilePopup } from './MobilePopup';

const StyledPopup = styled.div`
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
    }, [theplace]);

    if (!place) {
        return <p>Loading...</p>;
    }
    return <LocationDetailsBox place={place} />;
};

export const MarkerPopup = ({ place }) => {
    const [isClicked, setIsClicked] = useState(false);
    const map = useMap(); // Access the map instance to dynamically control popups.

    const handleMarkerClick = () => {
        setIsClicked(true);

        const popup = L.popup({
            autoClose: false,
            closeOnClick: false,
        })
            .setLatLng(place.position)
            .setContent(
                isMobile
                    ? `<div id="popup-${place.UUID}"></div>` // Placeholder for React content.
                    : `<div id="popup-${place.UUID}"></div>`
            )
            .openOn(map); // Attach the popup to the map.

        // Dynamically render React content inside the popup placeholder.
        const popupElement = document.getElementById(`popup-${place.UUID}`);
        if (popupElement) {
            ReactDOM.render(
                isMobile ? (
                    <MobilePopup onCloseHandler={() => popup.remove()}>
                        <LocationDetailsBoxWrapper key={place.UUID} theplace={place} />
                    </MobilePopup>
                ) : (
                    <StyledPopup>
                        <LocationDetailsBoxWrapper key={place.UUID} theplace={place} />
                    </StyledPopup>
                ),
                popupElement
            );
        }
    };

    return (
        <Marker
            position={place.position}
            eventHandlers={{
                click: handleMarkerClick,
            }}
        />
    );
};

MarkerPopup.propTypes = {
    place: PropTypes.shape({
        position: PropTypes.arrayOf(PropTypes.number).isRequired,
        UUID: PropTypes.string.isRequired,
    }).isRequired,
};
