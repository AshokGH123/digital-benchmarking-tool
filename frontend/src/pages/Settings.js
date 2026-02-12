import React from 'react';
import { Box, Typography, Paper, Grid, TextField, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Manage your profile and preferences.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              defaultValue={user?.name || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              defaultValue={user?.email || ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company"
              defaultValue={user?.company || ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Industry"
              defaultValue={user?.industry || ''}
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button variant="contained">Save Changes</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;
