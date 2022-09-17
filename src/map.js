import L from 'leaflet'
import 'leaflet.markercluster'
import {getFormattedData} from './formatters.js'
import {createCheckboxWithType} from './checkboxes.js'
import {createLanguageChooser} from './languages.js'

import * as ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom/client';
import React from 'react'

let mainMap        = createBasicMap();
let markers        = L.markerClusterGroup();
let cats           = null;

$.getJSON("/api/categories").then( categories => {
  cats = categories
  $( document ).ready(main);
});

function main() {
  mainMap.addLayer(markers);
  getNewMarkers(cats);
  $.getJSON("/api/categories", (categories) => {
    mainMap.addControl(createCommandBox(categories));
    refreshMap(categories);
    let filter_form = createFilterForm(categories);
    let filters_placeholder = ReactDOM.createRoot(document.getElementById('filtersome'));
    filters_placeholder.render(filter_form);
  });

  $.getJSON("/api/languages", (languages) => {
    let lang_list = document.getElementById('lang-list');
    let chooser = createLanguageChooser(languages);
    ReactDOM.createRoot(lang_list).render(chooser);
  });

};


function refreshMap(categories)
{
  mainMap.removeLayer(markers);
  markers = getNewMarkers(categories);
  mainMap.addLayer(markers);
}

function createLocationMarker(initialPosition)
{
  let locationIcon = new L.Icon(
  {
    iconUrl: 'https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_my_location_48px-512.png',
    iconSize: [25, 25],
    popupAnchor: [1, -34],
  });
  return L.marker(initialPosition, {icon: locationIcon});
}

function onLocationFound(e, map, locationMarker, circleMarker) {
  let radius = e.accuracy / 2;
  locationMarker.setLatLng(e.latlng);
  circleMarker.setLatLng(e.latlng).setRadius(radius);
}

function createBasicMap() {
  let initPos = [51.1,17.05];
  let map = L.map('map').setView(initPos, 13);
  map.zoomControl.setPosition('topright');
  let lMarker = createLocationMarker(initPos);
  let cMarker = L.circle(initPos, 2);
  let mapBase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  });
  map.addLayer(mapBase);
  map.on('locationfound', (e) => {onLocationFound(e, map, lMarker, cMarker)});
  map.locate({setView: false, watch:true, maxZoom: 16});
  lMarker.addTo(map);
  cMarker.addTo(map);
  return map;
}

function getNewMarkers(cats){
  let markeros = L.markerClusterGroup();
  let all_checkboxes = cats.map(([x, translation]) => getSelectedCheckboxesOfCategory(x));
  let filteros = all_checkboxes.filter(n => n).join('&');
  let url = ["/api/data", filteros].filter(n => n).join('?');
  $.getJSON(url, (response) => {
    response.map(x => L.marker(x.position).addTo(markeros).bindPopup(getFormattedData(x)));
  });
  return markeros;
}

function createCommandBox(categories) {
  let command = L.control({position: 'topleft'});
  command.onAdd = prepareFilterBox.bind(null, categories);
  return command;
}

function createCategorySection(section_header, section_elements){
  let header = React.createElement("span", {textcontent: section_header}, section_header);
  let checkboxes = section_elements.map(([field_name, translation]) => {
    return createCheckboxWithType(section_header, field_name, translation, refreshMap.bind(null, cats));
    });
  let result = React.createElement("div", {}, header, checkboxes);
  return result;
}

function getCategoryData(category_name, callback){
  fetch("/api/category/" + category_name)
    .then(res => res.json())
    .then(callback)
}


function createFilterForm(categories_with_translations) {
  let form = document.createElement('form');
  categories_with_translations.map(
    ([category_name, cat_translation]) => getCategoryData(category_name,
       (types_in_category) => {
        let sec = createCategorySection(cat_translation, types_in_category);
        form.appendChild(reactDomWrapper(sec));
    }
    ));
  return form;
}


function prepareFilterBox(categories) {
  let div = L.DomUtil.create('div', 'command');
  div.className="container form-control input-sm"
  let form = createFilterForm(categories)
  div.ondblclick = (ev) => {
    L.DomEvent.stopPropagation(ev)
  };
  div.appendChild(form);
  return div;
};

function reactDomWrapper(react_element){
  const tempDiv = document.createElement('div');
  ReactDOM.createRoot(tempDiv).render(react_element);
  return tempDiv;
}

function getSelectedCheckboxesOfCategory(filter_type){
  let selector = ".filter."+filter_type+":checked";
  let select = $(selector);
  let checked_boxes_types = $(".filter."+filter_type+":checked").toArray();
  let types = checked_boxes_types.map(x => filter_type + '=' + x.value).join('&');
  return types;
}
