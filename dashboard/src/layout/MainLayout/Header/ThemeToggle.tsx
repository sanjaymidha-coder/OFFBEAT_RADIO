// material-ui
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

// project imports
import useConfig from 'hooks/useConfig';

// assets
import { IconMoon, IconSun } from '@tabler/icons-react';

// types
import { ThemeMode } from 'types/config';

// ==============================|| THEME TOGGLE ||============================== //

const ThemeToggle = () => {
  const theme = useTheme();
  const { mode, onChangeMode } = useConfig();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 0, sm: 2 } }}>
      <Tooltip title={mode === ThemeMode.DARK ? 'Light Mode' : 'Dark Mode'}>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'secondary.light',
            color: theme.palette.mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
            '&:hover': {
              bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
              color: theme.palette.mode === ThemeMode.DARK ? 'secondary.light' : 'secondary.light'
            }
          }}
        >
          <IconButton
            onClick={() => onChangeMode(mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK)}
            color="inherit"
            sx={{ p: 0 }}
          >
            {mode === ThemeMode.DARK ? <IconSun size={20} /> : <IconMoon size={20} />}
          </IconButton>
        </Avatar>
      </Tooltip>
    </Box>
  );
};

export default ThemeToggle; 