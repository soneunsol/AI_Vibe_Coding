import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/AuthContext.jsx';
import { Box, CircularProgress } from '@mui/material';

import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import MyPage from './pages/MyPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import GatheringPage from './pages/GatheringPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ChatRoomPage from './pages/ChatRoomPage.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter basename="/AI_Vibe_Coding/mini_sns">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="create" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
          <Route path="mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
          <Route path="notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="gathering" element={<ProtectedRoute><GatheringPage /></ProtectedRoute>} />
          <Route path="chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="chat/:roomId" element={<ProtectedRoute><ChatRoomPage /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
