'use client';

import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third party
import { Props as ChartProps } from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import useConfig from 'hooks/useConfig';
import SeoChartCard from 'ui-component/cards/SeoChartCard';

// types
import { ThemeMode } from 'types/config';

// chart data
import {
  SeoChartCardOptions4,
  SeoChartCardOptions5,
  SeoChartCardOptions6,
  SeoChartCardOptions7
} from 'components/widget/Chart/chart-options';

// ==============================|| PAYMENT LIST - OVERVIEW ||============================== //

const Overview = () => {
  const { mode } = useConfig();
  const theme = useTheme();

  const grey = theme.palette.grey[500];
  const secondary = theme.palette.secondary.main;
  const success = theme.palette.success.main;
  const error = theme.palette.orange.main;

  useEffect(() => {
    setSeoChartCardOptions1((prevState: any) => ({
      ...prevState,
      colors: [grey],
      tooltip: {
        theme: mode
      }
    }));

    setSeoChartCardOptions2((prevState: any) => ({
      ...prevState,
      colors: [success],
      tooltip: {
        theme: mode
      }
    }));

    setSeoChartCardOptions3((prevState: any) => ({
      ...prevState,
      colors: [secondary],
      tooltip: {
        theme: mode
      }
    }));

    setSeoChartCardOptions4((prevState: any) => ({
      ...prevState,
      colors: [error],
      tooltip: {
        theme: mode
      }
    }));
  }, [mode, success, grey, secondary, error]);

  const [seoChartCardSeries1] = useState([{ data: [3, 0, 1, 2, 1, 1, 2] }]);
  const [seoChartCardSeries2] = useState([{ data: [3, 0, 1, 2, 1, 1, 2] }]);
  const [seoChartCardSeries3] = useState([{ data: [3, 0, 1, 2, 1, 1, 2] }]);
  const [seoChartCardSeries4] = useState([{ data: [3, 0, 1, 2, 1, 1, 2] }]);

  const [seoChartCardOptions1, setSeoChartCardOptions1] = useState<ChartProps>(SeoChartCardOptions4);
  const [seoChartCardOptions2, setSeoChartCardOptions2] = useState<ChartProps>(SeoChartCardOptions5);
  const [seoChartCardOptions3, setSeoChartCardOptions3] = useState<ChartProps>(SeoChartCardOptions6);
  const [seoChartCardOptions4, setSeoChartCardOptions4] = useState<ChartProps>(SeoChartCardOptions7);

  const chartsData = [
    { data: seoChartCardSeries1, options: seoChartCardOptions1, value: '810', title: 'Total Invoice' },
    { data: seoChartCardSeries2, options: seoChartCardOptions2, value: '25,890', title: 'Paid' },
    { data: seoChartCardSeries3, options: seoChartCardOptions3, value: '3400', title: 'Pending' },
    { data: seoChartCardSeries4, options: seoChartCardOptions4, value: '55,865', title: 'Overdue' }
  ];
  return (
    <MainCard>
      <Grid container alignItems="center" spacing={2.5}>
        <Grid item xs={12}>
          <Typography variant="h4">Overview</Typography>
        </Grid>
        {chartsData.map((data, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <SubCard
              content={false}
              sx={{
                '& .apexcharts-tooltip-series-group': {
                  bgcolor: mode === ThemeMode.DARK ? 'background.default' : 'background.paper'
                }
              }}
            >
              <SeoChartCard type={1} chartData={{ series: data.data, options: data.options }} value={data.value} title={data.title} />
            </SubCard>
          </Grid>
        ))}
      </Grid>
    </MainCard>
  );
};

export default Overview;
