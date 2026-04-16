import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert, CircularProgress, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { signUp } from '../services/authService';
import { useAuth } from '../store/AuthContext.jsx';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '', nickname: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    setLoading(true);
    try {
      const user = await signUp(form);
      login(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 3,
        background: 'linear-gradient(180deg, #FFF0E8 0%, #FFF8F5 100%)',
      }}
    >
        <Box sx={{ width: '100%', maxWidth: 360 }}>
          {/* 헤더 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => navigate('/login')} sx={{ color: '#FF6B35' }}>
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              <RestaurantMenuIcon sx={{ color: '#FF6B35' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FF6B35' }}>
                회원가입
              </Typography>
            </Box>
          </Box>

          {/* 회원가입 폼 */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              bgcolor: 'white',
              borderRadius: 3,
              p: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
              fullWidth
              label="아이디"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="비밀번호 (6자 이상)"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="닉네임"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #FF6B35, #FFB347)',
                boxShadow: '0 4px 12px rgba(255,107,53,0.4)',
                '&:hover': { background: 'linear-gradient(135deg, #E55A28, #E8A030)' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : '회원가입'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                이미 계정이 있으신가요?{' '}
                <Link to="/login" style={{ color: '#FF6B35', fontWeight: 600, textDecoration: 'none' }}>
                  로그인
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
    </Box>
  );
};

export default SignUpPage;
