import { MapContainer } from './components/Map/Map';
import './i18n';
import { loadPlugins } from './plugins/pluginLoader';

loadPlugins();
MapContainer();
