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

// types
import { ThemeMode } from 'types/config';

// ==============================|| CUSTOMIZATION - MODE ||============================== //

const InputFilled = () => {
  const theme = useTheme();
  const { outlinedFilled, onChangeOutlinedField } = useConfig();

  const changeInputBackground = (e: any) => {
    const newOutlinedFilled = e.target.value === 'filled';
    if (newOutlinedFilled !== outlinedFilled) {
      onChangeOutlinedField(newOutlinedFilled);
    }
  };

  return (
    <Stack direction="row" alignItems="center" pb={2} px={2} justifyContent="space-between" sx={{ width: '100%' }}>
      <Typography variant="h5">INPUT BACKGROUND</Typography>
      <RadioGroup row aria-label="layout" value={outlinedFilled} onChange={changeInputBackground} name="row-radio-buttons-group">
        <FormControlLabel
          control={<Radio value="filled" sx={{ display: 'none' }} />}
          label={
            <Avatar
              size="md"
              variant="rounded"
              outline
              sx={{
                mr: 1,
                width: 48,
                height: 30,
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.800' : 'grey.50',
                ...(!outlinedFilled && { borderColor: 'divider' })
              }}
            >
              {' '}
            </Avatar>
          }
        />
        <FormControlLabel
          control={<Radio value="outlined" sx={{ display: 'none' }} />}
          label={
            <Avatar size="md" variant="rounded" outline sx={{ width: 48, height: 30, ...(outlinedFilled && { borderColor: 'divider' }) }}>
              {' '}
            </Avatar>
          }
        />
      </RadioGroup>
    </Stack>
  );
};

export default InputFilled;
