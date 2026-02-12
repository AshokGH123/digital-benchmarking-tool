import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 2,
        px: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <Typography variant="body2" color="textSecondary">
          Digital Benchmarking Tool • {new Date().getFullYear()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Need help?{' '}
          <Link href="mailto:support@example.com" underline="hover">
            support@example.com
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
