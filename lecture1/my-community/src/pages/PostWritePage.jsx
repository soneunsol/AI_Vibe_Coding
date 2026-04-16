import { useState } from 'react';
import {
  Typography, TextField, Button, Box, Alert,
  Chip, IconButton, Tooltip, Card, CardContent, Divider,
} from '@mui/material';
import {
  AddPhotoAlternate as ImageIcon,
  Close as CloseIcon,
  Create as CreateIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { createPost } from '../services/postService';
import useAuth from '../hooks/useAuth';

const RANDOM_IMAGE_API = 'https://picsum.photos/800/400?random=';

const PostWritePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRandomImage = () => {
    const seed = Math.floor(Math.random() * 1000);
    setImageUrl(`${RANDOM_IMAGE_API}${seed}`);
  };

  const handleAddHashtag = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && hashtagInput.trim()) {
      e.preventDefault();
      const tag = hashtagInput.trim().replace(/^#/, '');
      if (tag && !hashtags.includes(tag)) {
        setHashtags((prev) => [...prev, tag]);
      }
      setHashtagInput('');
    }
  };

  const handleRemoveHashtag = (tag) => {
    setHashtags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const post = await createPost(title, content, user.id, imageUrl || null, hashtags);
      navigate(`/posts/${post.id}`);
    } catch {
      setError('게시글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CreateIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          새 글 작성
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card elevation={0} sx={{ mb: 2 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="제목"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시글 제목을 입력하세요"
            />
            <TextField
              fullWidth
              label="내용"
              variant="outlined"
              multiline
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요..."
            />

            <Divider />

            {/* 이미지 영역 */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                이미지
              </Typography>
              <Tooltip title="랜덤 이미지 추가">
                <Button
                  variant="outlined"
                  startIcon={<ImageIcon />}
                  onClick={handleRandomImage}
                  size="small"
                >
                  랜덤 이미지 추가
                </Button>
              </Tooltip>
              {imageUrl && (
                <Box
                  sx={{
                    mt: 1.5,
                    position: 'relative',
                    display: 'inline-block',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="미리보기"
                    style={{ width: '100%', maxWidth: 420, borderRadius: 12, display: 'block' }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => setImageUrl('')}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.55)',
                      color: '#fff',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* 해시태그 */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                해시태그
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="태그 입력 (Enter 또는 Space로 추가)"
                variant="outlined"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleAddHashtag}
                placeholder="#태그입력"
              />
              {hashtags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, flexWrap: 'wrap' }}>
                  {hashtags.map((tag) => (
                    <Chip
                      key={tag}
                      label={`#${tag}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      onDelete={() => handleRemoveHashtag(tag)}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ minWidth: 80 }}
        >
          취소
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{ minWidth: 100 }}
        >
          {submitting ? '등록 중...' : '등록하기'}
        </Button>
      </Box>
    </Layout>
  );
};

export default PostWritePage;
