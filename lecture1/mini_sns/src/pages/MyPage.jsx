import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Avatar, Typography, Button, Grid, CircularProgress,
  Modal, IconButton, Divider, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetchUserPosts } from '../services/postService';
import { updateProfile } from '../services/authService';
import { useAuth } from '../store/AuthContext.jsx';

const MyPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editImage, setEditImage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchUserPosts(user.id)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditOpen = () => {
    setEditNickname(user.nickname);
    setEditImage(user.profile_image_url);
    setEditOpen(true);
  };

  const handleRandomImage = () => {
    const seed = Math.random().toString(36).substring(7);
    setEditImage(`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`);
  };

  const handleEditSave = async () => {
    if (!editNickname.trim()) return;
    setSaving(true);
    try {
      const updated = await updateProfile(user.id, {
        nickname: editNickname.trim(),
        profile_image_url: editImage,
      });
      login(updated);
      setEditOpen(false);
    } catch {
      alert('프로필 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* 프로필 헤더 */}
      <Box sx={{ bgcolor: 'white', px: 2, pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            src={user.profile_image_url}
            sx={{ width: 80, height: 80, border: '3px solid #FF6B35' }}
          />
          <IconButton onClick={handleLogout} sx={{ color: '#999' }}>
            <LogoutIcon />
          </IconButton>
        </Box>

        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>{user.nickname}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>@{user.username}</Typography>

        {/* 팔로우/팔로워 */}
        <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography fontWeight={700}>{posts.length}</Typography>
            <Typography variant="caption" color="text.secondary">게시물</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography fontWeight={700}>{user.follower_count || 0}</Typography>
            <Typography variant="caption" color="text.secondary">팔로워</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography fontWeight={700}>{user.following_count || 0}</Typography>
            <Typography variant="caption" color="text.secondary">팔로잉</Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          fullWidth
          onClick={handleEditOpen}
          sx={{ borderColor: '#FF6B35', color: '#FF6B35', borderRadius: 2 }}
        >
          프로필 편집
        </Button>
      </Box>

      <Divider />

      {/* 게시물 그리드 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">아직 게시물이 없어요</Typography>
        </Box>
      ) : (
        <Grid container spacing={0.3} sx={{ mt: 0.3 }}>
          {posts.map((post) => (
            <Grid item xs={4} key={post.id}>
              <Box
                component="img"
                src={post.image_url}
                alt="post"
                onClick={() => setSelectedPost(post)}
                sx={{
                  width: '100%',
                  aspectRatio: '1/1',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  display: 'block',
                }}
                onError={(e) => { e.target.src = `https://picsum.photos/200/200?random=${post.id}`; }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* 프로필 편집 다이얼로그 */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>프로필 편집</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, pt: 1 }}>
            <Avatar src={editImage} sx={{ width: 80, height: 80, border: '3px solid #FF6B35' }} />
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleRandomImage}
              sx={{ color: '#FF6B35' }}
            >
              프로필 이미지 변경
            </Button>
            <TextField
              fullWidth
              label="닉네임"
              value={editNickname}
              onChange={(e) => setEditNickname(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)} color="inherit">취소</Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            disabled={saving || !editNickname.trim()}
            sx={{ background: 'linear-gradient(135deg, #FF6B35, #FFB347)' }}
          >
            {saving ? '저장 중...' : '저장'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 게시물 상세 모달 */}
      <Modal open={!!selectedPost} onClose={() => setSelectedPost(null)}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 480,
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {selectedPost && (
            <Box sx={{ bgcolor: 'white', mx: 2, borderRadius: 3, overflow: 'hidden' }}>
              {/* 모달 헤더 */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src={user.profile_image_url} sx={{ width: 32, height: 32 }} />
                  <Typography variant="body2" fontWeight={700}>{user.nickname}</Typography>
                </Box>
                <IconButton size="small" onClick={() => setSelectedPost(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* 이미지 */}
              <Box
                component="img"
                src={selectedPost.image_url}
                alt="post"
                sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.target.src = `https://picsum.photos/400/400?random=${selectedPost.id}`; }}
              />

              {/* 내용 */}
              <Box sx={{ px: 2, py: 1.5 }}>
                {selectedPost.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mb: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 14, color: '#FF6B35' }} />
                    <Typography variant="caption" color="text.secondary">{selectedPost.location}</Typography>
                  </Box>
                )}
                {selectedPost.caption && (
                  <Typography variant="body2" sx={{ mb: 0.5 }}>{selectedPost.caption}</Typography>
                )}
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FavoriteIcon sx={{ fontSize: 16, color: '#E53935' }} />
                    <Typography variant="caption">{selectedPost.like_count || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ChatBubbleIcon sx={{ fontSize: 16, color: '#999' }} />
                    <Typography variant="caption">{selectedPost.comments?.length || 0}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default MyPage;
