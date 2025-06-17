'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

// project imports
import Profile from 'components/users/social-profile/Profile';
import Followers from 'components/users/social-profile/Followers';
import Friends from 'components/users/social-profile/Friends';
import Gallery from 'components/users/social-profile/Gallery';
import FriendRequest from 'components/users/social-profile/FriendRequest';
import useAuth from 'hooks/useAuth';
import useConfig from 'hooks/useConfig';
import Avatar from 'ui-component/extended/Avatar';
import Chip from 'ui-component/extended/Chip';
import MainCard from 'ui-component/cards/MainCard';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import ImagePlaceholder from 'ui-component/cards/Skeleton/ImagePlaceholder';
import { gridSpacing } from 'store/constant';
import { DASHBOARD_PATH } from 'config';
import { handlerActiveItem, useGetMenuMaster } from 'api/menu';

// types
import { ThemeMode } from 'types/config';

// assets
import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';
import { IconFriends, IconInbox, IconPhoto, IconUserPlus, IconUsers } from '@tabler/icons-react';

const User1 = '/assets/images/users/img-user.png';
const Cover = '/assets/images/profile/img-profile-bg.png';

const tabOptions = [
  {
    to: '/apps/user/social-profile/posts',
    icon: <IconInbox stroke={1.5} size="17px" />,
    label: 'Profile',
    value: 'posts'
  },
  {
    to: '/apps/user/social-profile/follower',
    icon: <IconUsers stroke={1.5} size="17px" />,
    label: 'Followers',
    value: 'follower'
  },
  {
    to: '/apps/user/social-profile/friends',
    icon: <IconFriends stroke={1.5} size="17px" />,
    label: (
      <>
        friends <Chip label="100" size="small" chipcolor="secondary" sx={{ ml: 1.5 }} />
      </>
    ),
    value: 'friends'
  },
  {
    to: '/apps/user/social-profile/gallery',
    icon: <IconPhoto stroke={1.5} size="17px" />,
    label: 'Gallery',
    value: 'gallery'
  },
  {
    to: '/apps/user/social-profile/friend-request',
    icon: <IconUserPlus stroke={1.5} size="17px" />,
    label: 'Friend Request',
    value: 'friend-request'
  }
];

// ==============================|| SOCIAL PROFILE ||============================== //

type Props = {
  tab: string;
};

const SocialProfile = ({ tab }: Props) => {
  const theme = useTheme();

  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { borderRadius } = useConfig();
  const { menuMaster } = useGetMenuMaster();

  const [isLoading, setLoading] = useState(true);
  const [value, setValue] = React.useState(tab);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    router.replace(`${newValue}`);
  };

  let breadcrumbTitle = '';
  let breadcrumbHeading = '';

  switch (tab) {
    case 'follower':
      breadcrumbTitle = 'Follower';
      breadcrumbHeading = 'Follower';
      break;
    case 'friends':
      breadcrumbTitle = 'Friends';
      breadcrumbHeading = 'Friends';
      break;
    case 'gallery':
      breadcrumbTitle = 'Gallery';
      breadcrumbHeading = 'Gallery';
      break;
    case 'friend-request':
      breadcrumbTitle = 'Friend Request';
      breadcrumbHeading = 'Friend Request';
      break;
    case 'posts':
    default:
      breadcrumbTitle = 'Posts';
      breadcrumbHeading = 'Posts';
  }

  let breadcrumbLinks = [
    { title: 'Home', to: DASHBOARD_PATH },
    { title: 'Social Profile', to: '/apps/user/social-profile/posts' },
    { title: breadcrumbTitle }
  ];
  if (tab === 'posts') {
    breadcrumbLinks = [{ title: 'Home', to: DASHBOARD_PATH }, { title: 'Social Profile' }];
  }

  useEffect(() => {
    if (menuMaster.openedItem !== 'posts') handlerActiveItem('posts');
    // eslint-disable-next-line
  }, [pathname]);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <Breadcrumbs custom heading={breadcrumbHeading} links={breadcrumbLinks} />
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard
            contentSX={{
              p: 1.5,
              paddingBottom: '0px !important',
              [theme.breakpoints.down('lg')]: {
                textAlign: 'center'
              }
            }}
          >
            {isLoading ? (
              <ImagePlaceholder
                sx={{
                  borderRadius: `${borderRadius}px`,
                  overflow: 'hidden',
                  mb: 3,
                  height: { xs: 85, sm: 150, md: 260 }
                }}
              />
            ) : (
              <CardMedia
                component="img"
                image={Cover}
                sx={{ borderRadius: `${borderRadius}px`, overflow: 'hidden', mb: 3 }}
                alt="profile-background"
              />
            )}
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={3}>
                {isLoading ? (
                  <ImagePlaceholder
                    sx={{
                      margin: '-70px 0 0 auto',
                      borderRadius: '16px',
                      [theme.breakpoints.down('lg')]: {
                        margin: '-70px auto 0'
                      },
                      [theme.breakpoints.down('md')]: {
                        margin: '-60px auto 0'
                      },
                      width: { xs: 72, sm: 100, md: 140 },
                      height: { xs: 72, sm: 100, md: 140 }
                    }}
                  />
                ) : (
                  <Avatar
                    alt="User 1"
                    src={User1}
                    sx={{
                      margin: '-70px 0 0 auto',
                      borderRadius: '16px',
                      [theme.breakpoints.down('lg')]: {
                        margin: '-70px auto 0'
                      },
                      [theme.breakpoints.down('md')]: {
                        margin: '-60px auto 0'
                      },
                      width: { xs: 72, sm: 100, md: 140 },
                      height: { xs: 72, sm: 100, md: 140 }
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={9}>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h5">{user?.name}</Typography>
                    <Typography variant="subtitle2">Android Developer</Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Grid
                      container
                      spacing={1}
                      sx={{
                        justifyContent: 'flex-end',
                        [theme.breakpoints.down('lg')]: {
                          justifyContent: 'center'
                        }
                      }}
                    >
                      <Grid item>
                        <Button variant="outlined">Message</Button>
                      </Grid>
                      <Grid item>
                        <Button variant="contained" startIcon={<PersonAddTwoToneIcon />}>
                          Send Request
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container justifyContent="flex-end">
                  <Tabs
                    value={value}
                    variant="scrollable"
                    onChange={handleChange}
                    sx={{ marginTop: 2.5, '& .MuiTabs-flexContainer': { border: 'none' } }}
                  >
                    {tabOptions.map((option, index) => (
                      <Tab
                        key={index}
                        iconPosition="start"
                        value={option.value}
                        icon={option.icon}
                        label={option.label}
                        sx={{
                          minHeight: 'auto',
                          minWidth: 10,
                          py: 1.5,
                          px: 1,
                          mr: 2.25,
                          color: theme.palette.mode === ThemeMode.DARK ? 'grey.600' : 'grey.900',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      />
                    ))}
                  </Tabs>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ p: 0 }}>
            {tab === 'posts' && <Profile />}
            {tab === 'follower' && <Followers />}
            {tab === 'friends' && <Friends />}
            {tab === 'gallery' && <Gallery />}
            {tab === 'friend-request' && <FriendRequest />}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default SocialProfile;
