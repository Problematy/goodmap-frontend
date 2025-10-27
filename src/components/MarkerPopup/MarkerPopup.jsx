import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Marker } from 'react-leaflet';
import { isMobile } from 'react-device-detect';
import { Icon } from 'leaflet';
import { httpService } from '../../services/http/httpService';

import { LocationDetailsBox } from './LocationDetails';
import { MobilePopup } from './MobilePopup';
import { DesktopPopup } from './DesktopPopup';
import iconAsterisk from '../../res/img/marker-icon-asterisk.png';

/**
 * Wrapper component that fetches full location details and renders them in a popup.
 * Automatically selects between mobile and desktop popup layouts based on device type.
 *
 * @param {Object} props - Component props
 * @param {Object} props.theplace - Basic place object containing at minimum a uuid
 * @param {string} props.theplace.uuid - Unique identifier for the location
 * @returns {React.ReactElement} Popup component with location details or loading state
 */
const LocationDetailsBoxWrapper = ({ theplace }) => {
    const [place, setPlace] = useState(null);
    const ChosenPopup = isMobile ? MobilePopup : DesktopPopup;

    useEffect(() => {
        const fetchPlace = async () => {
            const fetchedPlace = await httpService.getLocation(theplace.uuid);
            setPlace(fetchedPlace);
        };
        fetchPlace();
    }, [theplace.uuid]);

    return (
        <ChosenPopup>
            {place ? <LocationDetailsBox place={place} /> : <p>Loading...</p>}
        </ChosenPopup>
    );
};

/**
 * Custom Leaflet icon for markers with remarks/special annotations.
 * Displays an asterisk icon to visually distinguish remarked locations from standard markers.
 */
const asteriskIcon = new Icon({
    iconUrl: iconAsterisk,
    // iconUrl: 'https://cdn-icons-png.flaticon.com/512/5650/5650380.png',
    // iconUrl: 'https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/external-legal-business-and-finance-icongeek26-linear-colour-icongeek26.png',
    iconSize: [40, 48], // size of the icon
    iconAnchor: [19, 46], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});

/**
 * Interactive map marker component that displays location details in a popup when clicked.
 * Supports special visual indication for locations with remarks using an asterisk icon.
 *
 * @param {Object} props - Component props
 * @param {Object} props.place - Location data object
 * @param {number[]} props.place.position - Coordinates [latitude, longitude]
 * @param {boolean} [props.place.remark] - Whether this location has a remark (uses asterisk icon if true)
 * @returns {React.ReactElement} Leaflet Marker component with click-to-show-details functionality
 */
export const MarkerPopup = ({ place }) => {
    const [isClicked, setIsClicked] = useState(false);
    const handleMarkerClick = e => {
        setIsClicked(true);
    };

    const markerProps = {
        position: place.position,
        eventHandlers: {
            click: handleMarkerClick,
        },
        alt: place.remark ? 'Marker-Asterisk' : 'Marker',
    };

    // Only add icon prop if we have a custom icon (for remarks)
    // This prevents passing undefined which can cause issues with MarkerClusterGroup
    if (place.remark) {
        markerProps.icon = asteriskIcon;
    }

    return (
        <Marker {...markerProps}>
            {isClicked && <LocationDetailsBoxWrapper theplace={place} />}
        </Marker>
    );
};

MarkerPopup.propTypes = {
    place: PropTypes.shape({
        position: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
};
