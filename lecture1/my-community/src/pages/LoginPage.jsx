import { useState } from 'react';
import {
  Box, Card, CardContent, Typography,
  TextField, Button, Alert, Link, Collapse,
} from '@mui/material';
import {
  MarkEmailRead as EmailIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { signIn, resendConfirmationEmail } from '../services/authService';
import Logo from '../components/common/Logo';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      setErrorType('other');
      return;
    }
    setLoading(true);
    setError('');
    setErrorType('');
    setResendSuccess(false);
    try {
      await signIn(username, password);
      navigate('/');
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('Email not confirmed')) {
        setErrorType('unconfirmed');
        setError('이메일 인증이 완료되지 않았습니다.');
      } else if (msg.includes('존재하지 않는 아이디')) {
        setErrorType('credentials');
        setError('존재하지 않는 아이디입니다.');
      } else if (
        msg.includes('Invalid login credentials') ||
        msg.includes('invalid_credentials')
      ) {
        setErrorType('credentials');
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setErrorType('other');
        setError(`로그인 실패: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setResendLoading(true);
    try {
      await resendConfirmationEmail(username);
      setResendSuccess(true);
    } catch (err) {
      setError(`재발송 실패: ${err?.message || '잠시 후 다시 시도해주세요.'}`);
    } finally {
      setResendLoading(false);
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

          {error && errorType !== 'unconfirmed' && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}

          <Collapse in={errorType === 'unconfirmed'}>
            <Alert severity="warning" icon={<EmailIcon />} sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                이메일 인증이 필요합니다
              </Typography>
              <Typography variant="caption" display="block" sx={{ mb: 1, lineHeight: 1.5 }}>
                가입 시 입력한 이메일로 발송된 인증 메일의 링크를 클릭해주세요.
                메일이 없다면 스팸함을 확인하거나 아래에서 재발송하세요.
              </Typography>
              {resendSuccess ? (
                <Alert severity="success" sx={{ py: 0.5, mt: 1 }}>
                  인증 메일을 재발송했습니다. 메일함을 확인해주세요.
                </Alert>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  startIcon={<RefreshIcon />}
                  onClick={handleResendEmail}
                  disabled={resendLoading}
                  sx={{ mt: 0.5 }}
                >
                  {resendLoading ? '발송 중...' : '인증 메일 재발송'}
                </Button>
              )}
            </Alert>
          </Collapse>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="아이디"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              error={errorType === 'credentials'}
              autoComplete="username"
            />
            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              error={errorType === 'credentials'}
              helperText={errorType === 'credentials' ? '아이디 또는 비밀번호를 확인해주세요.' : ''}
              autoComplete="current-password"
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
