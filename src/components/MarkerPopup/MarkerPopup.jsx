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

export const MarkerPopup = ({ place }) => {
    const [isClicked, setIsClicked] = useState(false);
    const handleMarkerClick = e => {
        setIsClicked(true);
    };

    if (place.remark) {
        return (
            <Marker
                position={place.position}
                eventHandlers={{
                    click: handleMarkerClick,
                }}
                icon={asteriskIcon}
                alt="Marker-Asterisk"
            >
                {isClicked && <LocationDetailsBoxWrapper theplace={place} />}
            </Marker>
        );
    }

    return (
        <Marker
            position={place.position}
            eventHandlers={{
                click: handleMarkerClick,
            }}
        >
            {isClicked && <LocationDetailsBoxWrapper theplace={place} />}
        </Marker>
    );
};

const asteriskIcon = new Icon({
    iconUrl: iconAsterisk,
    // iconUrl: 'https://cdn-icons-png.flaticon.com/512/5650/5650380.png',
    // iconUrl: 'https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/external-legal-business-and-finance-icongeek26-linear-colour-icongeek26.png',
    iconSize: [40, 48], // size of the icon
    iconAnchor: [19, 46], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});

MarkerPopup.propTypes = {
    place: PropTypes.shape({
        position: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
};
