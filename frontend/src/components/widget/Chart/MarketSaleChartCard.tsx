// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third party
import dynamic from 'next/dynamic';
import { Props as ChartProps } from 'react-apexcharts';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { IconBrandFacebook, IconBrandYoutube, IconBrandTwitter } from '@tabler/icons-react';

// types
import { ThemeMode } from 'types/config';

// ===========================|| MARKET SHARE CHART CARD ||=========================== //

const MarketChartCard = ({ chartData }: { chartData: ChartProps }) => {
  const theme = useTheme();

  return (
    <MainCard sx={{ '&>div': { p: 0, pb: '0px !important' } }}>
      <Box sx={{ p: 3 }}>
        <Grid container direction="column" spacing={3}>
          <Grid item container spacing={1} alignItems="center">
            <Grid item>
              <Typography variant="h3">Market Share</Typography>
            </Grid>
            <Grid item xs zeroMinWidth />
            <Grid item>
              <TrendingDownIcon fontSize="large" color="error" />
            </Grid>
            <Grid item>
              <Typography variant="h3">27, 695.65</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ mt: -2.5, fontWeight: 400 }} color="inherit" variant="h5">
              Department wise monthly sales report
            </Typography>
          </Grid>
          <Grid item container justifyContent="space-around" alignItems="center" spacing={3}>
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography
                    sx={{
                      width: 40,
                      height: 40,
                      color: 'secondary.main',
                      borderRadius: '12px',
                      padding: 1,
                      bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'secondary.light'
                    }}
                  >
                    <IconBrandFacebook stroke={1.5} />
                  </Typography>
                </Grid>
                <Grid item sm zeroMinWidth>
                  <Typography variant="h4">+ 45.36%</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography
                    sx={{
                      width: 40,
                      height: 40,
                      color: 'primary.main',
                      borderRadius: '12px',
                      padding: 1,
                      bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'primary.light'
                    }}
                  >
                    <IconBrandTwitter stroke={1.5} />
                  </Typography>
                </Grid>
                <Grid item sm zeroMinWidth>
                  <Typography variant="h4">- 50.69%</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography
                    sx={{
                      width: 40,
                      height: 40,
                      color: 'error.main',
                      borderRadius: '12px',
                      padding: 1,
                      bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : alpha(theme.palette.error.light, 0.25)
                    }}
                  >
                    <IconBrandYoutube stroke={2} />
                  </Typography>
                </Grid>
                <Grid item sm zeroMinWidth>
                  <Typography variant="h4">+ 16.85%</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs zeroMinWidth />
          </Grid>
        </Grid>
      </Box>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type={chartData.options?.chart?.type as ChartProps['type']}
        height={chartData.options?.chart?.height}
      />
    </MainCard>
  );
};

export default MarketChartCard;
