import ReactDOM from 'react-dom/client';
import React from 'react';

import { FiltersForm } from '../FiltersForm/FiltersForm';
import { MarkerPopup } from '../MarkerPopup/MarkerPopup';
import { MapComponent } from './MapComponent';
import { CategoriesProvider } from '../Categories/CategoriesContext';

const mapPlaceholder = ReactDOM.createRoot(document.getElementById('map'));
const filtersPlaceholder = ReactDOM.createRoot(document.getElementById('filter-form'));

export const Map = () => {
            {mapPlaceholder.render(      <CategoriesProvider><MapComponent /></CategoriesProvider>)}
            {filtersPlaceholder.render(      <CategoriesProvider><FiltersForm /></CategoriesProvider>)}

};
