import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert, CircularProgress,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { signIn } from '../services/authService';
import { useAuth } from '../store/AuthContext.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await signIn(form);
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
        {/* 로고 */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 4px 20px rgba(255,107,53,0.4)',
            }}
          >
            <RestaurantMenuIcon sx={{ fontSize: 48, color: 'white' }} />
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FF6B35, #FFB347)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.8rem',
              letterSpacing: '-0.5px',
            }}
          >
            맛스타그램
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            맛집을 공유하고, 친구와 함께해요
          </Typography>
        </Box>

        {/* 로그인 폼 */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 360,
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
            label="비밀번호"
            name="password"
            type="password"
            value={form.password}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              아직 계정이 없으신가요?{' '}
              <Link to="/signup" style={{ color: '#FF6B35', fontWeight: 600, textDecoration: 'none' }}>
                회원가입
              </Link>
            </Typography>
          </Box>
        </Box>
    </Box>
  );
};

export default LoginPage;
