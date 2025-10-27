import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import getGlobalObject from './utils/globalCompat';

import enMap from './locales/en/map.json';
import plMap from './locales/pl/map.json';
import uaMap from './locales/ua/map.json';

const globalObj = getGlobalObject();

i18n.use(initReactI18next).init({
    resources: {
        en: {
            map: enMap,
        },
        pl: {
            map: plMap,
        },
        uk: {
            map: uaMap,
        },
    },
    lng: globalObj.APP_LANG,
    fallbackLng: 'en',
    ns: ['map'],
    defaultNS: 'map',
    debug: false,
    interpolation: {
        escapeValue: false,
    },
});

export { i18n };
export default i18n;
