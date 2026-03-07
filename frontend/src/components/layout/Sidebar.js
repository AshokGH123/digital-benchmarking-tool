import React from 'react';
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as BenchmarkIcon,
  Analytics as AnalyticsIcon,
  Description as ReportsIcon,
  Settings as SettingsIcon,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '../../context/ThemeContext';
import useMediaQuery from '@mui/material/useMediaQuery';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Benchmark', icon: <BenchmarkIcon />, path: '/benchmark' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const { mode } = useTheme();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up('lg'));

  const handleNavigate = (path) => {
    navigate(path);
    if (!isDesktop && onClose) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', height: '100%', pt: 2 }}>
      <Box sx={{ px: 2, mb: 3 }}>
        <Box 
          sx={{ 
            background: mode === 'light'
              ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'
              : 'linear-gradient(135deg, #0A84FF 0%, #64D2FF 100%)',
            borderRadius: '16px',
            p: 2.5,
            color: 'white',
            textAlign: 'center',
            boxShadow: mode === 'light'
              ? '0 4px 12px rgba(0, 122, 255, 0.3)'
              : '0 4px 12px rgba(10, 132, 255, 0.4)',
          }}
        >
          <TrendingUp sx={{ fontSize: 36, mb: 1 }} />
          <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
            Performance Score
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
            87%
          </Typography>
        </Box>
      </Box>
      
      <List sx={{ px: 1.5 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => handleNavigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: '12px',
              mb: 0.5,
              transition: 'all 0.2s',
              '&.Mui-selected': {
                background: mode === 'light'
                  ? 'rgba(0, 122, 255, 0.12)'
                  : 'rgba(10, 132, 255, 0.2)',
                color: mode === 'light' ? '#007AFF' : '#0A84FF',
                '&:hover': {
                  background: mode === 'light'
                    ? 'rgba(0, 122, 255, 0.18)'
                    : 'rgba(10, 132, 255, 0.3)',
                },
                '& .MuiListItemIcon-root': {
                  color: mode === 'light' ? '#007AFF' : '#0A84FF',
                },
              },
              '&:hover': {
                background: mode === 'light'
                  ? 'rgba(0, 0, 0, 0.04)'
                  : 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
            />
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
    </Box>
  );

  return (
    <Drawer
      variant={isDesktop ? 'persistent' : 'temporary'}
      open={Boolean(mobileOpen)}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: 260,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 260,
          boxSizing: 'border-box',
          backdropFilter: 'blur(40px) saturate(180%)',
          backgroundColor: mode === 'light'
            ? 'rgba(255, 255, 255, 0.85)'
            : 'rgba(28, 28, 30, 0.85)',
          borderRight: mode === 'light'
            ? '1px solid rgba(0, 0, 0, 0.08)'
            : '1px solid rgba(84, 84, 88, 0.48)',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
