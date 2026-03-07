import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { GitHub, LinkedIn, Twitter, Favorite } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { mode } = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backdropFilter: 'blur(40px) saturate(180%)',
        backgroundColor: mode === 'light'
          ? 'rgba(255, 255, 255, 0.85)'
          : 'rgba(28, 28, 30, 0.85)',
        borderTop: mode === 'light'
          ? '1px solid rgba(0, 0, 0, 0.08)'
          : '1px solid rgba(84, 84, 88, 0.48)',
        py: 2.5,
        px: 4,
        mt: 'auto',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Digital Benchmarking Tool
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Empowering data-driven decisions
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="text.secondary">
            Made with
          </Typography>
          <Favorite sx={{ fontSize: 16, color: '#FF3B30' }} />
          <Typography variant="body2" color="text.secondary">
            by Ashok
          </Typography>
        </Box>

        <Box display="flex" gap={0.5}>
          <IconButton size="small">
            <GitHub fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <LinkedIn fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <Twitter fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box mt={1.5} textAlign="center">
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Digital Benchmarking Tool. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
