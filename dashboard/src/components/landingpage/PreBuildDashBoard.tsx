import Link from 'next/link';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { Carousel } from 'react-responsive-carousel';

// assets
import { IconChevronRight, IconChevronLeft, IconLink } from '@tabler/icons-react';

const SliderLight1 = '/assets/images/landing/pre-apps/slider-light-1.png';
const SliderDark1 = '/assets/images/landing/pre-apps/slider-dark-1.png';
const SliderLight2 = '/assets/images/landing/pre-apps/slider-light-2.png';
const SliderDark2 = '/assets/images/landing/pre-apps/slider-dark-2.png';
const SliderLight3 = '/assets/images/landing/pre-apps/slider-light-3.png';
const SliderDark3 = '/assets/images/landing/pre-apps/slider-dark-3.png';
const SliderLight4 = '/assets/images/landing/pre-apps/slider-light-4.png';
const SliderDark4 = '/assets/images/landing/pre-apps/slider-dark-4.png';
const SliderLight5 = '/assets/images/landing/pre-apps/slider-light-5.png';
const SliderDark5 = '/assets/images/landing/pre-apps/slider-dark-5.png';
const SliderLight6 = '/assets/images/landing/pre-apps/slider-light-6.png';
const SliderDark6 = '/assets/images/landing/pre-apps/slider-dark-6.png';

// types
import { ThemeMode } from 'types/config';

// styles
const Images = styled('img')({
  width: '100%',
  height: 'auto',
  marginBottom: 32,
  backgroundSize: 'cover',
  objectFit: 'cover'
});

function SampleNextArrow(props: any) {
  const theme = useTheme();
  const { onClickHandler } = props;

  return (
    <IconButton
      onClick={onClickHandler}
      sx={{
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% - 70px)',
        cursor: 'pointer',
        bgcolor: `${theme.palette.background.paper} !important`,
        width: { xs: '40px !important', xl: '65px !important' },
        height: { xs: '40px !important', xl: '65px !important' },
        boxShadow: '0px 24px 38px rgba(9, 15, 37, 0.07)',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          transform: 'scale(9)'
        },
        svg: {
          height: { md: 20, lg: 40, xl: '40px' },
          width: { md: 20, lg: 40, xl: '40px' }
        },
        right: { xs: '50px', md: '80px', lg: '120px', xl: '220px' }
      }}
      aria-label="button"
    >
      <IconChevronRight fontSize={25} color={theme.palette.grey[900]} />
    </IconButton>
  );
}

function SamplePrevArrow(props: any) {
  const theme = useTheme();
  const { onClickHandler } = props;

  return (
    <IconButton
      onClick={onClickHandler}
      sx={{
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% - 70px)',
        cursor: 'pointer',
        bgcolor: `${theme.palette.background.paper} !important`,
        width: { xs: '40px !important', xl: '65px !important' },
        height: { xs: '40px !important', xl: '65px !important' },
        boxShadow: '0px 24px 38px rgba(9, 15, 37, 0.07)',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          transform: 'scale(9)'
        },
        svg: {
          height: { md: 20, lg: 40, xl: '40px' },
          width: { md: 20, lg: 40, xl: '40px' }
        },
        left: { xs: '50px', md: '80px', lg: '120px', xl: '220px' }
      }}
      aria-label="button"
    >
      <IconChevronLeft fontSize={25} color={theme.palette.grey[900]} />
    </IconButton>
  );
}

interface ItemProps {
  title: string;
  caption?: string;
  image: string;
  link: string;
}

const Items = ({ title, caption, image, link }: ItemProps) => {
  return (
    <>
      <Images
        src={image}
        alt="dashboard"
        sx={{
          width: { xs: '100%', xl: 743 },
          objectFit: 'contain',
          direction: 'initial'
        }}
      />
      <Stack spacing={1} sx={{ pt: 1 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          component={Link}
          href={link}
          target="_blank"
          sx={{ textDecoration: 'none' }}
        >
          <Typography variant="h3" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <IconButton size="small" sx={{ color: 'text.primary' }}>
            <IconLink aria-label="link button" size={18} />
          </IconButton>
        </Stack>
        <Typography variant="subtitle2" color="text.primary" sx={{ fontSize: { xs: '1rem', xl: '1.125rem' } }}>
          {caption}
        </Typography>
      </Stack>
    </>
  );
};

const PreBuildDashBoard = () => {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Grid container spacing={7.5} justifyContent="center" sx={{ px: 1.25 }}>
        <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                Explore Concenputal Apps
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ fontWeight: 400 }} align="center">
                Berry has conceptul working apps like Chat, Inbox, E-commerce, Invoice, Kanban, and Calendar
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box
            className="preBuildDashBoard-slider"
            sx={{
              direction: 'initial',
              '.slider': { height: { xs: 'auto' }, '& .slide:not(.selected)': { transformOrigin: 'center !important' } }
            }}
          >
            <Carousel
              showArrows={true}
              showThumbs={false}
              showIndicators={false}
              centerMode={downMD ? false : true}
              centerSlidePercentage={50}
              infiniteLoop={true}
              autoFocus={true}
              emulateTouch={true}
              swipeable={true}
              autoPlay={true}
              interval={2000}
              renderArrowPrev={(onClickHandler, hasPrev, label) =>
                hasPrev && <SamplePrevArrow onClickHandler={onClickHandler} hasPrev={hasPrev} label={label} />
              }
              renderArrowNext={(onClickHandler, hasNext, label) =>
                hasNext && <SampleNextArrow onClickHandler={onClickHandler} hasNext={hasNext} label={label} />
              }
            >
              <Items
                title="Mail/Message App"
                image={theme.palette.mode === ThemeMode.DARK ? SliderDark5 : SliderLight5}
                link="/apps/mail"
              />
              <Items title="Chat App" image={theme.palette.mode === ThemeMode.DARK ? SliderDark3 : SliderLight3} link="/apps/chat" />
              <Items
                title="Kanban App"
                image={theme.palette.mode === ThemeMode.DARK ? SliderDark4 : SliderLight4}
                link="/apps/kanban/board"
              />
              <Items
                title="Calendar App"
                image={theme.palette.mode === ThemeMode.DARK ? SliderDark2 : SliderLight2}
                link="/apps/calendar"
              />
              <Items
                title="Ecommerce App"
                image={theme.palette.mode === ThemeMode.DARK ? SliderDark1 : SliderLight1}
                link="/apps/e-commerce/products"
              />
              <Items
                title="Social Profile"
                image={theme.palette.mode === ThemeMode.DARK ? SliderDark6 : SliderLight6}
                link="/apps/user/social-profile/posts"
              />
            </Carousel>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default PreBuildDashBoard;
