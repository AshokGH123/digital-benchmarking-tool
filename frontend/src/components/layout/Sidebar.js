import React from 'react';
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as BenchmarkIcon,
  Analytics as AnalyticsIcon,
  Description as ReportsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
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
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const handleNavigate = (path) => {
    navigate(path);
    if (!isDesktop && onClose) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto' }}>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => handleNavigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <Drawer
      variant={isDesktop ? 'persistent' : 'temporary'}
      open={Boolean(mobileOpen)}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
