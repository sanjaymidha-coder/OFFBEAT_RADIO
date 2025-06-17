'use client';

// material-ui
import { styled } from '@mui/material/styles';

// types
import { ThemeMode } from 'types/config';

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper1 = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === ThemeMode.DARK ? theme.palette.background.default : theme.palette.grey[100],
  minHeight: '100vh'
}));

export default AuthWrapper1;
