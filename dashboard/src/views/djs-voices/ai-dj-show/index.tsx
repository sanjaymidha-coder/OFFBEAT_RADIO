'use client';

import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { gridSpacing } from 'store/constant';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ArtistCard from 'views/apps/user/card/ArtistCard';
import UserList from 'components/users/list/Style1/UserList';
import ArtistSongsList from 'views/apps/user/list/ArtistSongsList';

// types
import { TabsProps } from 'types';
import { ThemeMode } from 'types/config';

// tab panel
function TabPanel({ children, value, index, ...other }: TabsProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// ==============================|| AI DJ SHOW PAGE ||============================== //

const AIDJShow = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
        <MainCard>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            variant="scrollable"
            aria-label="simple tabs example"
            sx={{
              mb: 3,
              '& a': {
                minHeight: 'auto',
                minWidth: 10,
                px: 1,
                py: 1.5,
                mr: 2.25,
                color: theme.palette.mode === ThemeMode.DARK ? 'grey.600' : 'grey.900',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              },
              '& a.Mui-selected': {
                color: 'primary.main'
              }
            }}
          >
            <Tab label="Generated Shows" {...a11yProps(0)} />
            <Tab label="Add New Show" {...a11yProps(1)} />
          </Tabs>
        </MainCard>
        <br />

        <TabPanel value={value} index={0}>
          <MainCard>
            <Typography variant="body2">
              List of your generated AI DJ shows will appear here.
            </Typography>
          </MainCard>
        </TabPanel>


      <TabPanel value={value} index={1}>
        <Grid container spacing={gridSpacing} sx={{ minHeight: 'calc(100vh - 280px)', height: 'calc(100vh - 280px)' }}>
          <Grid item xs={12} sm={12} md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={gridSpacing} sx={{ flex: 1, height: '100%' }}>
              <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <MainCard sx={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                    <ArtistCard />
                  </Box>
                </MainCard>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={8} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={gridSpacing} sx={{ flex: 1, height: '100%' }}>
              <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <MainCard sx={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                    <ArtistSongsList />
                    <Grid container spacing={2} xs={12} sx={{ mt: 2 }}>
                      <Grid item xs={12} md={4}>
                        <Autocomplete
                          options={['DJ Nova', 'DJ Echo', 'DJ Pulse', 'DJ Sonic']}
                          renderInput={(params) => <TextField {...params} label="Select DJ Voice" variant="outlined" />}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={3} display="flex" alignItems="center" justifyContent="center">
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                          sx={{ minWidth: 200, fontWeight: 600, fontSize: 18 }}
                          startIcon={<span style={{ fontSize: 22 }}>🚀</span>}
                        >
                          Generate DJ Show
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </MainCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
      </TabPanel>
    </>
  );
};

export default AIDJShow; 