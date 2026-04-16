import { useState } from 'react';
import {
  Box, Card, CardContent, Typography,
  TextField, Button, Alert, Link, Chip, Stack,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { signUp, checkUsernameAvailable } from '../services/authService';
import Logo from '../components/common/Logo';

const PASSWORD_RULES = [
  { label: '8자 이상', test: (pw) => pw.length >= 8 },
  { label: '영문 포함', test: (pw) => /[a-zA-Z]/.test(pw) },
  { label: '숫자 포함', test: (pw) => /[0-9]/.test(pw) },
  { label: '특수문자 포함', test: (pw) => /[!@#$%^&*]/.test(pw) },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);

  const handleCheckUsername = async () => {
    if (!username.trim()) return;
    setUsernameStatus('checking');
    const available = await checkUsernameAvailable(username.trim());
    setUsernameStatus(available ? 'available' : 'taken');
  };

  const allRulesPass = PASSWORD_RULES.every((r) => r.test(password));

  const handleRegister = async () => {
    if (!username || !password) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    if (usernameStatus !== 'available') {
      setError('아이디 중복확인을 완료해주세요.');
      return;
    }
    if (!allRulesPass) {
      setError('비밀번호 규칙을 모두 충족해주세요.');
      return;
    }
    setLoading(true);
    try {
      await signUp(username.trim(), password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const wrapperSx = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fce7f3 100%)',
    p: 2,
  };

  if (success) {
    return (
      <Box sx={wrapperSx}>
        <Card elevation={0} sx={{ width: '100%', maxWidth: 420, borderRadius: 3, boxShadow: '0 20px 60px rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.1)' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Logo variant="login" />
            <Alert severity="success" sx={{ mb: 2.5 }}>
              회원가입이 완료되었습니다! 바로 로그인하세요.
            </Alert>
            <Button fullWidth variant="contained" size="large" onClick={() => navigate('/login')}>
              로그인 페이지로 이동
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={wrapperSx}>
      <Card elevation={0} sx={{ width: '100%', maxWidth: 460, borderRadius: 3, boxShadow: '0 20px 60px rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.1)' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Logo variant="login" />

          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, textAlign: 'center', color: 'text.primary' }}>
            회원가입
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 아이디 + 중복확인 */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="아이디"
                variant="outlined"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setUsernameStatus(null); }}
                autoComplete="username"
              />
              <Button
                variant="outlined"
                sx={{ whiteSpace: 'nowrap', minWidth: 90 }}
                onClick={handleCheckUsername}
                disabled={!username.trim() || usernameStatus === 'checking'}
              >
                중복확인
              </Button>
            </Box>
            {usernameStatus === 'available' && (
              <Alert severity="success" sx={{ py: 0.5 }}>사용 가능한 아이디입니다.</Alert>
            )}
            {usernameStatus === 'taken' && (
              <Alert severity="error" sx={{ py: 0.5 }}>이미 사용 중인 아이디입니다.</Alert>
            )}

            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
                비밀번호 규칙
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.5}>
                {PASSWORD_RULES.map((rule) => {
                  const pass = password.length > 0 && rule.test(password);
                  const inactive = password.length === 0;
                  return (
                    <Chip
                      key={rule.label}
                      label={rule.label}
                      size="small"
                      icon={inactive ? undefined : pass ? <CheckCircleIcon /> : <CancelIcon />}
                      color={inactive ? 'default' : pass ? 'success' : 'error'}
                      variant={inactive ? 'outlined' : 'filled'}
                      sx={{ opacity: inactive ? 0.5 : 1 }}
                    />
                  );
                })}
              </Stack>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleRegister}
              disabled={loading}
              sx={{ py: 1.4, fontSize: '1rem' }}
            >
              {loading ? '처리 중...' : '회원가입'}
            </Button>
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              이미 계정이 있으신가요?{' '}
              <Link
                component="button"
                onClick={() => navigate('/login')}
                sx={{ color: 'primary.main', fontWeight: 600 }}
              >
                로그인
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
