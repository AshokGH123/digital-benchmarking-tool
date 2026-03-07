import React from 'react';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

export const GlassCard = ({ children, gradient, ...props }) => (
  <Card
    {...props}
    sx={{
      background: gradient || 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      borderRadius: '16px',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.2)',
      },
      ...props.sx,
    }}
  >
    {children}
  </Card>
);

export const StatCard = ({ title, value, icon, trend, color, bgGradient }) => (
  <GlassCard
    sx={{
      background: bgGradient,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box flex={1}>
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ fontSize: 40, opacity: 0.8 }}>
          {icon}
        </Box>
      </Box>
      {trend && (
        <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.9 }}>
          {trend}
        </Typography>
      )}
    </CardContent>
  </GlassCard>
);

export const ActionButton = ({ icon, label, onClick, color = 'primary' }) => (
  <IconButton
    onClick={onClick}
    sx={{
      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
      color: 'white',
      width: 48,
      height: 48,
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'scale(1.1) rotate(5deg)',
        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
      },
    }}
  >
    {icon}
  </IconButton>
);

export const GradientText = ({ children, variant = 'h4' }) => (
  <Typography
    variant={variant}
    sx={{
      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 700,
    }}
  >
    {children}
  </Typography>
);

export const InsightCard = ({ icon, text, color }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      p: 2,
      background: 'white',
      borderRadius: '12px',
      border: '1px solid rgba(99, 102, 241, 0.1)',
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'translateX(4px)',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
      },
    }}
  >
    <Box sx={{ color: color, fontSize: 32 }}>
      {icon}
    </Box>
    <Typography variant="body2" sx={{ fontWeight: 500 }}>
      {text}
    </Typography>
  </Box>
);
