import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getContentAsString, mapCustomTypeToReactComponent } from './mapCustomTypeToReactComponent';
import { Marker, Popup } from 'react-leaflet';
import { buttonStyleSmall } from '../../styles/buttonStyle';
import ExploreIcon from '@mui/icons-material/Explore';

const isCustomValue = value => typeof value === 'object' && !(value instanceof Array);

const mapDataToPopupContent = ([dataKey, value]) => {
    if (isCustomValue(value)) {
        const CustomDataComponent = mapCustomTypeToReactComponent(value);
        return (
            <PopupDataRow key={dataKey} fieldName={dataKey} valueToDisplay={CustomDataComponent} />
        );
    }
    return <PopupDataRow key={dataKey} fieldName={dataKey} valueToDisplay={value} />;
};

const PopupDataRow = ({ fieldName, valueToDisplay }) => (
    <p key={fieldName} className="m-0">
        <b>{fieldName}</b>
        {`: `}
        {getContentAsString(valueToDisplay)}
    </p>
);

PopupDataRow.propTypes = {
    fieldName: PropTypes.string.isRequired,
    valueToDisplay: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array,
        PropTypes.element,
    ]).isRequired,
};

const MarkerContent = ({ place }) => {
    const categoriesWithSubcategories = Object.entries(place.data);

    return (
        <div className="place-data m-0">
            <p className="point-title m-0">
                <b>{place.title}</b>
            </p>
            <p className="point-subtitle mt-0 mb-2">{place.subtitle}</p>
            {categoriesWithSubcategories.map(mapDataToPopupContent)}
        </div>
    );
};

const ReportProblemForm = ({ placeId }) => {
    const [problem, setProblem] = useState('');

    const handleSubmit = async event => {
        event.preventDefault();

        const response = await fetch('/api/report-location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: placeId,
                description: problem,
            }),
        });

        if (response.ok) {
            // TODO add snackbar with success message
        } else {
            // TODO add snackbar with failing to report problem
            console.log('Failed to report problem');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Problem:
                <input
                    type="text"
                    name="problem"
                    value={problem}
                    onChange={e => setProblem(e.target.value)}
                />
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
};

export const MarkerPopup = ({ place }) => {
    const [showForm, setShowForm] = useState(false);
    const toggleForm = () => setShowForm(!showForm);

    const categoriesWithSubcategories = Object.entries(place.data);

    return (
        <Marker position={place.position} key={place.metadata.UUID}>
            <Popup>
                <MarkerContent place={place} />
                <a href={`geo:${place.position[0]},${place.position[1]}`}>
                  <p style={{...buttonStyleSmall, justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
                      <ExploreIcon style={{ color: 'white', marginRight: '10px' }} />
                      <span>Navigate me</span>
                  </p>
                </a>
                <p onClick={toggleForm} style={{ cursor: 'pointer', color: 'blue', textAlign: 'right' }}>
                    Report problem
                </p>
                {showForm && <ReportProblemForm placeId={place.metadata.UUID} />}
            </Popup>
        </Marker>
    );
};

MarkerPopup.propTypes = {
    place: PropTypes.shape({
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired,
        data: PropTypes.shape({}).isRequired,
    }).isRequired,
};
