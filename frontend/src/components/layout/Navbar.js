import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Badge } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Dashboard as DashboardIcon, Menu as MenuIcon, MenuOpen as MenuOpenIcon, Notifications, DarkMode, LightMode } from '@mui/icons-material';

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backdropFilter: 'blur(40px) saturate(180%)',
        backgroundColor: mode === 'light' 
          ? 'rgba(255, 255, 255, 0.85)' 
          : 'rgba(28, 28, 30, 0.85)',
        borderBottom: mode === 'light'
          ? '1px solid rgba(0, 0, 0, 0.08)'
          : '1px solid rgba(84, 84, 88, 0.48)',
        color: mode === 'light' ? '#000' : '#fff',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ 
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: mode === 'light'
                  ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'
                  : 'linear-gradient(135deg, #0A84FF 0%, #64D2FF 100%)',
              }}
            >
              <DashboardIcon sx={{ fontSize: 20, color: 'white' }} />
            </Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              Benchmarking
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" alignItems="center" gap={1.5}>
          <IconButton 
            color="inherit" 
            onClick={toggleTheme}
            sx={{ 
              '&:hover': { transform: 'scale(1.1)' },
              transition: 'transform 0.2s',
            }}
          >
            {mode === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar 
              sx={{ 
                bgcolor: mode === 'light' ? '#007AFF' : '#0A84FF',
                width: 36,
                height: 36,
                fontWeight: 600,
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user?.name}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{ 
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
              '&:hover': {
                borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)',
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
