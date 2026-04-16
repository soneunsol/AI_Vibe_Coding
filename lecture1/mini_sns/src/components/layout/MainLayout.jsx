import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import NavBar from './NavBar.jsx';
import BottomNav from './BottomNav.jsx';

const MainLayout = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      <NavBar />
      <Box component="main" sx={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </Box>
      <BottomNav />
    </Box>
  );
};

export default MainLayout;
