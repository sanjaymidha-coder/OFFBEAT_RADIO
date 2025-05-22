// material-ui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// types
import { GenericCardProps } from 'types';

interface UserCountCardProps {
  primary: string;
  secondary: string;
  iconPrimary: GenericCardProps['iconPrimary'];
  color: string;
}

// =============================|| USER NUM CARD ||============================= //

const UserCountCard = ({ primary, secondary, iconPrimary, color }: UserCountCardProps) => {
  const IconPrimary = iconPrimary!;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;

  return (
    <Card sx={{ bgcolor: color, position: 'relative', color: '#fff' }}>
      <CardContent>
        <Box
          sx={{
            position: 'absolute',
            left: '-17px',
            bottom: '-27px',
            color: '#fff',
            transform: 'rotate(25deg)',
            '&> svg': {
              width: '100px',
              height: '100px',
              opacity: '0.35'
            }
          }}
        >
          {primaryIcon}
        </Box>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={1}>
          <Grid item sm={12}>
            <Typography variant="h3" align="center" color="inherit">
              {secondary}
            </Typography>
          </Grid>
          <Grid item sm={12}>
            <Typography variant="body1" align="center" color="inherit">
              {primary}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserCountCard;
