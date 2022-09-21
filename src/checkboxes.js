import React from 'react';

export function createCheckboxWithType(filter_type, field_name, translation, onclick) {
  let label = React.createElement("label", {htmlFor: field_name}, translation);
  let checkbox = React.createElement("input", {
    className: "form-check-input filter "+filter_type,
    type: "checkbox",
    name: "name",
    value: field_name,
    id: field_name,
    onClick: onclick
  });

  return React.createElement("div", {className: "form-check", key: field_name}, label, checkbox);
}

function createCategorySection(section_header, section_elements){
  let header = React.createElement("span", {textcontent: section_header}, section_header);
  let checkboxes = section_elements.map(([field_name, translation]) => {
    return createCheckboxWithType(section_header, field_name, translation, refreshMap.bind(null, cats));
    });
  let result = React.createElement("div", {}, header, checkboxes);
  return result;
}


async function getCategoriesData(){
  let categories = await fetch("/api/categories")
  categories_content = categories.map( category_name =>
    fetch("/api/category/" + category_name)
    );
  const results = await Promixe.all(categories_content)
  return results;
}




function createFilterForm(categories_with_translations) {
  let form = document.createElement('form');
  categories_data = getCategoriesData();
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
