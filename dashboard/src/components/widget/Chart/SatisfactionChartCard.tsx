import dynamic from 'next/dynamic';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third-party
import { Props as ChartProps } from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// =========================|| SATISFACTION CHART CARD ||========================= //

const SatisfactionChartCard = ({ chartData }: { chartData: ChartProps }) => {
  return (
    <MainCard>
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Typography variant="subtitle1">Customer Satisfaction</Typography>
        </Grid>
        <Grid item>
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type={chartData.options?.chart?.type as ChartProps['type']}
            height={chartData.options?.chart?.height}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default SatisfactionChartCard;
