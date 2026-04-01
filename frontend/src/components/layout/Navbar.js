import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Badge, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Dashboard as DashboardIcon, Menu as MenuIcon, MenuOpen as MenuOpenIcon, Notifications, DarkMode, LightMode, SmartToy, Assessment } from '@mui/icons-material';

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const notifications = [
    { id: 1, text: 'New benchmark data available', icon: <Assessment />, action: '/benchmark' },
    { id: 2, text: 'AI insights ready for review', icon: <SmartToy />, action: '/ai-insights' },
    { id: 3, text: 'Process health alert: 2 critical', icon: <Notifications />, action: '/process-health' },
  ];

  const handleNotificationItemClick = (action) => {
    navigate(action);
    handleNotificationClose();
  };

  const viewAllNotifications = () => {
    navigate('/notifications');
    handleNotificationClose();
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
          <IconButton 
            color="inherit"
            onClick={() => navigate('/ai-insights')}
            sx={{ 
              '&:hover': { transform: 'scale(1.1)' },
              transition: 'transform 0.2s',
              background: mode === 'light'
                ? 'linear-gradient(135deg, #007AFF15 0%, #5AC8FA15 100%)'
                : 'linear-gradient(135deg, #0A84FF20 0%, #64D2FF20 100%)',
            }}
          >
            <SmartToy />
          </IconButton>
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <Badge badgeContent={notifications.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: {
                width: 320,
                maxHeight: 400,
                mt: 1,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Notifications</Typography>
            </Box>
            <Divider />
            {notifications.map((notif) => (
              <MenuItem key={notif.id} onClick={() => handleNotificationItemClick(notif.action)}>
                <ListItemIcon>{notif.icon}</ListItemIcon>
                <ListItemText primary={notif.text} primaryTypographyProps={{ variant: 'body2' }} />
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={viewAllNotifications}>
              <ListItemText primary="View All Notifications" primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
            </MenuItem>
          </Menu>
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
