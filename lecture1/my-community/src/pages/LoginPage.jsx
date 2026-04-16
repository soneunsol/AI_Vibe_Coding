import { useState } from 'react';
import {
  Box, Card, CardContent, Typography,
  TextField, Button, Alert, Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../services/authService';
import Logo from '../components/common/Logo';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('Email not confirmed')) {
        setError('이메일 인증이 필요합니다. 가입 시 받은 이메일의 인증 링크를 클릭해주세요.');
      } else if (msg.includes('Invalid login credentials')) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError(`로그인 실패: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fce7f3 100%)',
        p: 2,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(99,102,241,0.12), 0 4px 16px rgba(0,0,0,0.06)',
          border: '1px solid rgba(99,102,241,0.1)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Logo variant="login" />

          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, textAlign: 'center', color: 'text.primary' }}>
            로그인
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="이메일"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={loading}
              sx={{ py: 1.4, fontSize: '1rem' }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              계정이 없으신가요?{' '}
              <Link
                component="button"
                onClick={() => navigate('/register')}
                sx={{ color: 'primary.main', fontWeight: 600 }}
              >
                회원가입하기
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
