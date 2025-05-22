// material-ui
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

// types
import { ColorPaletteProps } from 'types';

// ==============================|| CALENDAR COLOR PALETTE ||============================== //

const ColorPalette = ({ color, label, value }: ColorPaletteProps) => (
  <FormControlLabel
    value={value}
    control={<Radio sx={{ color, '&.Mui-checked': { color } }} />}
    label={label || ''}
    sx={{ pr: label ? 1 : 0 }}
  />
);

export default ColorPalette;
