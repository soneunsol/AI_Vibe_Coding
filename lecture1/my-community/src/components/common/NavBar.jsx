import { AppBar, Toolbar, Button, Box, IconButton, Tooltip } from '@mui/material';
import {
  Create as CreateIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { signOut } from '../../services/authService';
import Logo from './Logo';

const NavBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Logo variant="nav" />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {user ? (
            <>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CreateIcon />}
                onClick={() => navigate('/write')}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  display: { xs: 'none', sm: 'flex' },
                }}
              >
                글쓰기
              </Button>
              <Tooltip title="글쓰기">
                <IconButton
                  onClick={() => navigate('/write')}
                  sx={{ color: '#fff', display: { xs: 'flex', sm: 'none' } }}
                  size="small"
                >
                  <CreateIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="로그아웃">
                <IconButton
                  onClick={handleSignOut}
                  sx={{
                    color: 'rgba(255,255,255,0.85)',
                    '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },
                  }}
                  size="small"
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <Button
                size="small"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' },
                }}
              >
                로그인
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PersonAddIcon />}
                onClick={() => navigate('/register')}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                회원가입
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
