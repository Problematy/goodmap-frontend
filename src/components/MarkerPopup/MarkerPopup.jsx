import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import ExploreIcon from '@mui/icons-material/Explore';
import { isMobile } from 'react-device-detect';
import { getContentAsString, mapCustomTypeToReactComponent } from './mapCustomTypeToReactComponent';
import { buttonStyleSmall } from '../../styles/buttonStyle';
import { ReportProblemForm } from './ReportProblemForm';
import { useTranslation } from 'react-i18next';
import { httpService } from '../../services/http/httpService';

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

const MarkerContent = ({ place_id }) => {
    const { t } = useTranslation();
    const [place, setPlace] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchPlace = async () => {
            const fetchedPlace = await httpService.getLocation(place_id);
            setPlace(fetchedPlace);
        };
        fetchPlace();
    }, [place_id]);

    const toggleForm = () => setShowForm(!showForm);

    if (!place) {
        return <Popup><p>Loading...</p></Popup>;
    }

    // TODO CTA should not be any special case. It is just different format, like website is.
    const categoriesWithSubcategories = place.data.filter(([category]) => category !== 'CTA');
    const CTACategories = place.data.filter(([category]) => category === 'CTA');

    return (
        <Popup>
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
                    }}
                >
                    {categoriesWithSubcategories.map(([category, value]) => (
                        <React.Fragment key={category}>
                            <p className="m-0" style={{ margin: 0 }}>
                                {`${category}:`}
                            </p>
                            <div
                                style={{
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-word',
                                    maxWidth: '100%',
                                }}
                            >
                                <PopupValue valueToDisplay={value} />
                            </div>
                        </React.Fragment>
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
        </Popup>
    );
};

export const MarkerPopup = ({ place }) => {
    const [isClicked, setIsClicked] = useState(false);

    return (
        <Marker
            position={place.position}
            eventHandlers={{
                click: () => {
                    setIsClicked(true);
                },
            }}
        >

        <MarkerContent place_id={place.UUID} />

        </Marker>
    );
};

MarkerPopup.propTypes = {
    place: PropTypes.shape({
         position: PropTypes.arrayOf(PropTypes.number).isRequired,
         UUID: PropTypes.string.isRequired
    }).isRequired,
};
