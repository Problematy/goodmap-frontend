import ReactDOM from 'react-dom/client';
import React from 'react';
import {createPortal} from 'react-dom';
import { FiltersForm } from '../FiltersForm/FiltersForm';
import { MarkerPopup } from '../MarkerPopup/MarkerPopup';
import { MapComponent } from './MapComponent';
import { CategoriesProvider } from '../Categories/CategoriesContext';

const MapWrap = () => {
    const filtersPlaceholder = document.getElementById('filter-form');
    const mapPlaceholder = document.getElementById('map');

    if (!filtersPlaceholder || !mapPlaceholder) {
        console.error("Nie znaleziono elementów docelowych w DOM");
        return null;
    }

    return (
        <CategoriesProvider>
            {createPortal(<FiltersForm />, filtersPlaceholder)}
            {createPortal(<MapComponent />, mapPlaceholder)}
        </CategoriesProvider>
    );
};

export const Map = () => {
  const appContainer = document.createElement('div');
  document.body.appendChild(appContainer);

  const root = ReactDOM.createRoot(appContainer);
  root.render(<MapWrap />);
}
