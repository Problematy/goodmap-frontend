import PropTypes from 'prop-types';
import ExploreIcon from '@mui/icons-material/Explore';
import { useTranslation } from 'react-i18next';
import { isMobile } from 'react-device-detect';
import { buttonStyleSmall } from '../../styles/buttonStyle';
import { getContentAsString, mapCustomTypeToReactComponent } from './mapCustomTypeToReactComponent';
import { ReportProblemForm } from './ReportProblemForm';

import React, { useState } from 'react';

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

// TODO Replace with MarkerContentWrapper after /api/data endpoint is removed from backend
// const MarkerContent = ({ place }) => {
//     // TODO CTA should not be any special case. It is just different format, like website is.
//     const categoriesWithSubcategories = place.data.filter(([category]) => category !== 'CTA');
//     const CTACategories = place.data.filter(([category]) => category === 'CTA');
//
//     return (
//         <Marker
//             position={place.position}
//             key={place.metadata.UUID}
//             eventHandlers={{ click: handleClickOpen }}
//         >
//             <MobilePopup isOpen={open} onCloseHandler={handleClose}>
//                 <MarkerContent place={place} isMobileVariable={true} />
//             </MobilePopup>
//         </Marker>
//     );
// };

export const LocationDetails = ({ place }) => {
    const { t } = useTranslation();
    const categoriesWithSubcategories = place.data.filter(([category]) => !(category === 'CTA'));
    const CTACategories = place.data.filter(([category]) => category === 'CTA');
    const [showForm, setShowForm] = useState(false);
    const toggleForm = () => setShowForm(!showForm);

    return (
        <React.Fragment>
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
                        <React.Fragment key={category}>
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
        </React.Fragment>
    );
};
