'use client';

// material-ui
import { styled } from '@mui/material/styles';
import AppBar from 'ui-component/extended/AppBar';

// project import
import Customization from 'layout/Customization';

// ==============================|| LAYOUTS - STRUCTURE ||============================== //

const headerBackground = '/assets/images/landing/bg-header.jpg';
const HeaderWrapper = styled('div')(({ theme }) => ({
  backgroundImage: `url(${headerBackground})`,
  backgroundSize: '100% 600px',
  backgroundAttachment: 'fixed',
  backgroundRepeat: 'no-repeat',
  textAlign: 'center',
  paddingTop: 30,
  [theme.breakpoints.down('md')]: {
    paddingTop: 0
  }
}));

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <HeaderWrapper>
      <AppBar />
      {children}
      <Customization />
    </HeaderWrapper>
  );
}
