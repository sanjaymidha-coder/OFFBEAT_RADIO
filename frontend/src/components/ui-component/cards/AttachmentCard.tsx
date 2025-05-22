// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import { gridSpacing } from 'store/constant';

// types
import { ThemeMode } from 'types/config';

// assets
import DownloadForOfflineTwoToneIcon from '@mui/icons-material/DownloadForOfflineTwoTone';

const backImage = '/assets/images/profile';

// ==============================|| ATTACHMENT CARD ||============================== //

interface AttachmentCardProps {
  title: string;
  image: string;
}

const AttachmentCard = ({ title, image }: AttachmentCardProps) => {
  const theme = useTheme();
  const backProfile = image && `${backImage}/${image}`;

  return (
    <Card sx={{ bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'grey.100' }}>
      <CardMedia component="img" image={backProfile} title="Slider5 image" />
      <CardContent sx={{ p: 2, pb: '16px !important' }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs zeroMinWidth>
            <Typography variant="h5" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title}
            </Typography>
          </Grid>
          <Grid item>
            <DownloadForOfflineTwoToneIcon sx={{ cursor: 'pointer' }} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AttachmentCard;
