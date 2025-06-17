// material-ui
import { useTheme } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import Avatar from 'ui-component/extended/Avatar';
import useConfig from 'hooks/useConfig';

// assets
import { IconMoon, IconSun } from '@tabler/icons-react';

// types
import { ThemeMode } from 'types/config';

// ==============================|| CUSTOMIZATION - MODE ||============================== //

const ThemeModeLayout = () => {
  const theme = useTheme();
  const { mode, onChangeMode } = useConfig();

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2.5} sx={{ p: 2, width: '100%' }}>
      <Typography variant="h5">THEME MODE</Typography>
      <RadioGroup
        row
        aria-label="layout"
        value={mode}
        onChange={(e) => onChangeMode(e.target.value as ThemeMode)}
        name="row-radio-buttons-group"
      >
        <FormControlLabel
          control={<Radio value={ThemeMode.LIGHT} sx={{ display: 'none' }} />}
          label={
            <Avatar
              variant="rounded"
              outline
              color={theme.palette.mode !== ThemeMode.DARK ? 'primary' : 'dark'}
              sx={{ mr: 1, width: 48, height: 48 }}
            >
              <IconSun color={theme.palette.warning.dark} />
            </Avatar>
          }
        />
        <FormControlLabel
          control={<Radio value={ThemeMode.DARK} sx={{ display: 'none' }} />}
          label={
            <Avatar
              size="md"
              variant="rounded"
              {...(theme.palette.mode === ThemeMode.DARK && { outline: true })}
              color={theme.palette.mode === ThemeMode.DARK ? 'primary' : 'dark'}
              sx={{ width: 48, height: 48, color: 'grey.100' }}
            >
              <IconMoon style={{ transform: 'rotate(220deg)' }} />
            </Avatar>
          }
        />
      </RadioGroup>
    </Stack>
  );
};

export default ThemeModeLayout;
