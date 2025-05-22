// third party
import { Roboto } from 'next/font/google';

// types
import { ConfigProps, MenuOrientation, ThemeDirection, ThemeMode } from 'types/config';

// basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
// like '/berry-material-react/react/default'
export const BASE_PATH = '';

export const DASHBOARD_PATH = '/dashboard/default';
export const HORIZONTAL_MAX_ITEM = 7;

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });

const config: ConfigProps = {
  menuOrientation: MenuOrientation.VERTICAL,
  miniDrawer: false,
  fontFamily: roboto.style.fontFamily,
  borderRadius: 8,
  outlinedFilled: true,
  mode: ThemeMode.LIGHT,
  presetColor: 'default',
  i18n: 'en',
  themeDirection: ThemeDirection.LTR,
  container: false
};

export default config;
