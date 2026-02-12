import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dashboard as DashboardIcon, Menu as MenuIcon, MenuOpen as MenuOpenIcon } from '@mui/icons-material';

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            aria-label={sidebarOpen ? 'close sidebar' : 'open sidebar'}
            sx={{ mr: 1, display: 'inline-flex' }}
          >
            {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <DashboardIcon />
          <Typography variant="h6" component="div">
            Digital Benchmarking Tool
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Typography variant="body1">
            {user?.name}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleLogout}
            sx={{ borderColor: 'white', color: 'white' }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
