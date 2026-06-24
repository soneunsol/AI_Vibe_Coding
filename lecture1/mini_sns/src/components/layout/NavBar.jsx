import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LogoutIcon from '@mui/icons-material/Logout';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useAuth } from '../../store/AuthContext.jsx';

const NavBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,107,53,0.15)',
        top: 0,
        zIndex: 100,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 56 }}>
        {/* 로고 */}
        <Box
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B35, #FFB347)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RestaurantMenuIcon sx={{ fontSize: 18, color: 'white' }} />
          </Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #FF6B35, #FFB347)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}
          >
            맛스타그램
          </Typography>
        </Box>

        {/* 알림 & 로그아웃 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/notifications')} sx={{ color: '#FF6B35' }}>
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton onClick={handleLogout} sx={{ color: '#FF6B35' }}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
