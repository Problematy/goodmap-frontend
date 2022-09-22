import React from 'react';
import * as ReactDOMServer from 'react-dom/server';


function getContentAsString(data){
  return Array.isArray(data)? data.join(', ') : data
}

function getFormattedDataForPopup(data){
  return Object.keys(data).map(x => "<b>"+x+"</b>" + ": " + getContentAsString(data[x]));
}

export function getFormattedData(place){
  let name = React.createElement("p", {},
    React.createElement("b", {}, place.title),
    React.createElement("br"),
    place.subtitle);

  let content = React.createElement("p", {
    dangerouslySetInnerHTML: {
      __html: getFormattedDataForPopup(place.data).join('<br>')
  }});

  let main = React.createElement("div", {className: "place-data"}, name, content);
  return ReactDOMServer.renderToStaticMarkup(main);;
}



function createCheckbox(name, translation, category_name, onclick_action){
  const label = React.createElement("label",{htmlFor:name}, translation);
  const checkbox = React.createElement("input", {className: "form-check-input filter " + category_name, type:"checkbox",
    id:name, value:name});
  const checkboxdiv = React.createElement("div",{className: "form-check", onClick: onclick_action}, label, checkbox);
  return checkboxdiv;
}

export function createSection(datum, onclick_action){
  const category_data = datum[0]
  const title = React.createElement("span", {textcontent: category_data[0]}, category_data[1])
  const subcat_data = datum[1]
  const checkboxes = subcat_data.map(([name, translation]) => createCheckbox(name, translation, category_data[0], onclick_action))

  const section = React.createElement("div",{}, title, checkboxes);
  return section;
}


export function createFilterForm2(categories_data, onclick_action) {
  const sections = categories_data.map(x=>createSection(x, onclick_action))
  const form = React.createElement("form", {}, sections)
  return form;
}
