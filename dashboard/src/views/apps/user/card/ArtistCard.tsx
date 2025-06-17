'use client';

import React, { useState } from 'react';

// material-ui
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Pagination from '@mui/material/Pagination';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Avatar from 'ui-component/cards/../extended/Avatar';
import { gridSpacing } from 'store/constant';

// assets
import { IconSearch } from '@tabler/icons-react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// types
import { ThemeMode } from 'types/config';
import { useTheme } from '@mui/material/styles';

// Static data for artists
const staticArtists = [
  {
    id: 1,
    name: 'John Doe',
    avatar: '/images/artists/artist1.jpg',
    status: 'Active',
    color: '#1976d2'
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: '',
    status: 'Inactive',
    color: '#d32f2f'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    avatar: '/images/artists/artist3.jpg',
    status: 'Active',
    color: '#388e3c'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    avatar: '',
    status: 'Active',
    color: '#fbc02d'
  },
  {
    id: 1,
    name: 'John Doe',
    avatar: '/images/artists/artist1.jpg',
    status: 'Active',
    color: '#1976d2'
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: '',
    status: 'Inactive',
    color: '#d32f2f'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    avatar: '/images/artists/artist3.jpg',
    status: 'Active',
    color: '#388e3c'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    avatar: '',
    status: 'Active',
    color: '#fbc02d'
  },
  {
    id: 1,
    name: 'John Doe',
    avatar: '/images/artists/artist1.jpg',
    status: 'Active',
    color: '#1976d2'
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: '',
    status: 'Inactive',
    color: '#d32f2f'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    avatar: '/images/artists/artist3.jpg',
    status: 'Active',
    color: '#388e3c'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    avatar: '',
    status: 'Active',
    color: '#fbc02d'
  }
];

const FacebookWrapper = Button;
const TwitterWrapper = Button;
const LinkedInWrapper = Button;

type Artist = {
  id: number;
  name: string;
  avatar: string;
  status: string;
  color: string;
};

const CARDS_PER_PAGE = 6;

const ArtistSimpleCard = ({ artist }: { artist: Artist }) => {
  const theme = useTheme();
  const firstLetter = artist.name.charAt(0).toUpperCase();
  return (
    <Card
      sx={{
        p: 2,
        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.50',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        position: 'relative',
        overflow: 'visible',
        transition: 'border-color 0.2s',
        '&:hover': {
          borderColor: 'primary.main'
        }
      }}
    >
      {/* Status Chip absolute at top right */}
      <Chip
        label={artist.status === 'Active' ? 'Active' : 'Inactive'}
        size="small"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2,
          bgcolor:
            artist.status === 'Active'
              ? theme.palette.mode === ThemeMode.DARK
                ? 'dark.main'
                : 'success.light'
              : theme.palette.mode === ThemeMode.DARK
              ? 'dark.main'
              : 'error.light',
          color: artist.status === 'Active' ? 'success.dark' : 'error.dark',
          fontWeight: 600
        }}
      />
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} container justifyContent="center" sx={{ mt: 2, mb: 1 }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: artist.color,
              color: '#fff',
              fontSize: 32,
              fontWeight: 700
            }}
          >
            {firstLetter}
          </Avatar>
        </Grid>
        <Grid item xs={12} alignItems="center">
          <Grid container spacing={gridSpacing} alignItems="center">
            <Grid item xs zeroMinWidth>
              <Typography variant="h4" align="center">{artist.name}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

const ArtistCard = () => {
  const [artists, setArtists] = useState<Artist[]>(staticArtists);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newString = event.target.value;
    setSearch(newString);
    setPage(1);
    if (newString) {
      const filteredArtists = staticArtists.filter((artist) =>
        artist.name.toLowerCase().includes(newString.toLowerCase())
      );
      setArtists(filteredArtists);
    } else {
      setArtists(staticArtists);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(artists.length / CARDS_PER_PAGE);
  const paginatedArtists = artists.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => setPage(value);

  let artistsResult = paginatedArtists.map((artist, index) => (
    <Grid key={index} item xs={12} sm={6} md={6} lg={6}>
      <ArtistSimpleCard artist={artist} />
    </Grid>
  ));

  return (
    <MainCard
      title={
        <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
          <Grid item>
            <Typography variant="h3">Artists</Typography>
          </Grid>
          <Grid item>
            <OutlinedInput
              id="input-search-artists"
              placeholder="Search artists"
              value={search}
              onChange={handleSearch}
              startAdornment={
                <InputAdornment position="start">
                  <IconSearch stroke={1.5} size="16px" />
                </InputAdornment>
              }
              size="small"
            />
          </Grid>
        </Grid>
      }
    >
      <Grid container direction="row" spacing={gridSpacing}>
        {artistsResult}
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={gridSpacing}>
            <Grid item>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ArtistCard; 