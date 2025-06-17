'use client';

import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// project imports
import { gridSpacing } from 'store/constant';
import Avatar from '../extended/Avatar';

// types
import { ThemeMode } from 'types/config';
import { UserProfile } from 'types/user-profile';

// assets
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import NotInterestedTwoToneIcon from '@mui/icons-material/NotInterestedTwoTone';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';

const avatarImage = '/assets/images/users';

// ==============================|| USER DETAILS CARD ||============================== //

const UserDetailsCard = ({ about, avatar, contact, email, location, name, role }: UserProfile) => {
  const theme = useTheme();
  const avatarProfile = avatar && `${avatarImage}/${avatar}`;

  const [anchorEl, setAnchorEl] = useState<Element | (() => Element) | null | undefined>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      sx={{
        p: 2,
        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.50',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': { borderColor: 'primary.main' }
      }}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs zeroMinWidth>
              <Avatar alt={name} size="lg" src={avatarProfile} />
            </Grid>
            <Grid item>
              <IconButton size="small" sx={{ mt: -0.75, mr: -0.75 }} onClick={handleClick} aria-label="more options">
                <MoreHorizOutlinedIcon
                  fontSize="small"
                  color="inherit"
                  aria-controls="menu-friend-card"
                  aria-haspopup="true"
                  sx={{ opacity: 0.6 }}
                />
              </IconButton>
              {anchorEl && (
                <Menu
                  id="menu-user-details-card"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  variant="selectedMenu"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <MenuItem onClick={handleClose}>Edit</MenuItem>
                  <MenuItem onClick={handleClose}>Delete</MenuItem>
                </Menu>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3">{name}</Typography>
          <Typography variant="caption">{role}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: 'grey.700' }}>
            {about}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">Email</Typography>
          <Typography variant="h6">{email}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={6}>
              <Typography variant="caption">Phone</Typography>
              <Typography variant="h6">{contact}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption">Location</Typography>
              <Typography variant="h6">{location}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button variant="outlined" fullWidth startIcon={<ChatBubbleTwoToneIcon />}>
                Message
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined" color="error" fullWidth startIcon={<NotInterestedTwoToneIcon />}>
                Block
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default UserDetailsCard;
