import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import MainCard from 'ui-component/cards/MainCard';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';

const staticSongs = [
  { id: 1, name: 'Song A', album: 'Album X', duration: '3:45' },
  { id: 2, name: 'Song B', album: 'Album Y', duration: '4:12' },
  { id: 3, name: 'Song C', album: 'Album X', duration: '2:58' },
  { id: 4, name: 'Song D', album: 'Album Z', duration: '5:01' },
  { id: 5, name: 'Song E', album: 'Album Y', duration: '3:33' },
  { id: 6, name: 'Song F', album: 'Album X', duration: '4:20' },
  { id: 7, name: 'Song G', album: 'Album Z', duration: '3:15' },
  { id: 8, name: 'Song H', album: 'Album Y', duration: '2:50' },
  { id: 9, name: 'Song I', album: 'Album X', duration: '3:10' },
  { id: 10, name: 'Song J', album: 'Album Z', duration: '4:05' },
  { id: 1, name: 'Song A', album: 'Album X', duration: '3:45' },
  { id: 2, name: 'Song B', album: 'Album Y', duration: '4:12' },
  { id: 3, name: 'Song C', album: 'Album X', duration: '2:58' },
  { id: 4, name: 'Song D', album: 'Album Z', duration: '5:01' },
  { id: 5, name: 'Song E', album: 'Album Y', duration: '3:33' },
  { id: 6, name: 'Song F', album: 'Album X', duration: '4:20' },
  { id: 7, name: 'Song G', album: 'Album Z', duration: '3:15' },
  { id: 8, name: 'Song H', album: 'Album Y', duration: '2:50' },
  { id: 9, name: 'Song I', album: 'Album X', duration: '3:10' },
  { id: 10, name: 'Song J', album: 'Album Z', duration: '4:05' }
];

const ArtistSongsList = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState('');

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(filteredSongs.map((song) => song.id));
    } else {
      setSelected([]);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredSongs = staticSongs.filter((song) =>
    song.name.toLowerCase().includes(search.toLowerCase()) ||
    song.album.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 10);

  return (
    <MainCard
      title={
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item>
            <Typography variant="h3">Artist's Songs</Typography>
          </Grid>
          <Grid item>
            <OutlinedInput
              id="input-search-artists-songs"
              placeholder="Search Artist's Songs"
              value={search}
              onChange={handleSearch}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              }
              size="small"
            />
          </Grid>
        </Grid>
      }
      content={false}
    >
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < filteredSongs.length}
                  checked={filteredSongs.length > 0 && selected.length === filteredSongs.length}
                  onChange={handleSelectAll}
                  inputProps={{ 'aria-label': 'select all songs' }}
                />
              </TableCell>
              <TableCell>Song Name</TableCell>
              <TableCell>Album</TableCell>
              <TableCell>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSongs.map((song) => (
              <TableRow key={song.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(song.id)}
                    onChange={() => handleSelect(song.id)}
                    inputProps={{ 'aria-label': `select song ${song.name}` }}
                  />
                </TableCell>
                <TableCell>{song.name}</TableCell>
                <TableCell>{song.album}</TableCell>
                <TableCell>{song.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid item xs={12} sx={{ p: 3 }}>
        <Grid container justifyContent="space-between" spacing={2}>
          <Grid item>
            <Pagination count={1} color="primary" />
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ArtistSongsList; 