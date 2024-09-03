import React from 'react';
import PropTypes from 'prop-types';
import { getContentAsString, mapCustomTypeToReactComponent } from './mapCustomTypeToReactComponent';
import { Marker, Popup } from 'react-leaflet';

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

export const MarkerPopup = ({ place }) => {
    const categoriesWithSubcategories = Object.entries(place.data);

    return (
        <Marker position={place.position} key={place.metadata.UUID}>
          <Popup>
            <MarkerContent place={place} />
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
