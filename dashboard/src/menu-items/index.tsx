// menu import
import dashboard from './dashboard';
import stations from './stations';
import djsVoices from './djs-voices';
import schedule from './schedule';
import artists from './artists';
import analytics from './analytics';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [dashboard, stations, djsVoices, schedule, artists, analytics]
};

export default menuItems;
