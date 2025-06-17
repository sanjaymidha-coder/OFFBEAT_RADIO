'use client';

import React from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';

// types
import { KeyedObject } from 'types';

// rating labels
const labels: KeyedObject = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Normal',
  3: 'Normal+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+'
};

// ===============================|| UI RATING - HOVER ||=============================== //

export default function HoverRating() {
  const [value, setValue] = React.useState<number | null>(2);
  const [hover, setHover] = React.useState<number>(-1);

  return (
    <div>
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <Rating
            name="hover-feedback"
            value={value}
            precision={0.5}
            onChange={(event: React.SyntheticEvent<Element, Event>, newValue: number | null) => {
              setValue(newValue);
            }}
            onChangeActive={(event: React.SyntheticEvent<Element, Event>, newHover: number) => {
              setHover(newHover);
            }}
          />
        </Grid>
        <Grid item>
          {value !== null && (
            <Box
              sx={{
                ml: 2
              }}
            >
              {labels[hover !== -1 ? hover : value]}
            </Box>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
