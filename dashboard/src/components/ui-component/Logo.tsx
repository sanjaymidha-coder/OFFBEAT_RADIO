// material-ui
import { useTheme } from '@mui/material/styles';

// types
import { ThemeMode } from 'types/config';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="Berry" width="100" />
     *
     */
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 32" width="92" height="32">
	<title>logo</title>
	<path id="OFFBEAT"  aria-label="OFFBEAT" fill={theme.palette.mode === ThemeMode.DARK ? theme.palette.common.white : theme.palette.grey[800]} d="m13.9 14.7v3q0 3.6-1.7 5.6-1.6 1.9-4.6 1.9-3 0-4.7-1.9-1.8-2-1.8-5.5v-3q0-3.7 1.7-5.8 1.7-2 4.7-2 3 0 4.7 2 1.7 2 1.7 5.7zm-3.6 3.1v-3.1q0-2.4-0.6-3.5-0.7-1.2-2.2-1.2-1.4 0-2.1 1.1-0.7 1.1-0.7 3.5v3.1q0 2.3 0.7 3.5 0.7 1.1 2.2 1.1 1.4 0 2-1.1 0.7-1.1 0.7-3.4zm15.4-3v2.9h-5.6v7.3h-3.6v-17.8h9.9v3h-6.3v4.6zm11.9 0v2.9h-5.6v7.3h-3.6v-17.8h9.9v3h-6.3v4.6zm8.6 10.2h-5.9v-17.8h5.5q2.8 0 4.3 1.3 1.4 1.2 1.4 3.6 0 1.4-0.6 2.3-0.6 1-1.6 1.5 1.2 0.3 1.8 1.3 0.7 1.1 0.7 2.6 0 2.6-1.5 3.9-1.4 1.3-4.1 1.3zm0.3-7.7h-2.6v4.7h2.3q1 0 1.5-0.6 0.5-0.6 0.5-1.7 0-2.4-1.7-2.4zm-2.6-7.1v4.5h1.9q2.1 0 2.1-2.2 0-1.2-0.5-1.8-0.5-0.5-1.6-0.5zm19.6 4.2v2.9h-5.5v4.7h6.6v3h-10.2v-17.8h10.1v3h-6.5v4.2zm12.5 10.6l-1-3.6h-4.9l-0.9 3.6h-3.8l5.5-17.8h3.3l5.6 17.8zm-3.4-13l-1.7 6.4h3.4zm18.9-4.8v3h-4.4v14.7h-3.6v-14.7h-4.3v-3z"/>
</svg>
  );
};

export default Logo;
