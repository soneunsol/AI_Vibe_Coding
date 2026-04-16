import { useState, useEffect } from 'react';
import {
  Typography, Card, CardContent, CardActionArea,
  Box, Chip, CircularProgress, Alert, Fab, Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  ChatBubbleOutline as CommentIcon,
  Visibility as ViewIcon,
  Favorite as LikeIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { getPosts } from '../services/postService';
import useAuth from '../hooks/useAuth';

const PostListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(() => setError('게시글을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      {/* 헤더 배너 */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #7c3aed 100%)',
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          mb: 3,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: -60,
            right: 60,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          },
        }}
      >
        {user ? (
          <>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              안녕하세요, {user.user_metadata?.username || user.email}님! 👋
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              오늘도 DevDesign Hub에서 지식을 나눠보세요.
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              DevDesign Hub 커뮤니티
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              디자인과 개발 지식을 자유롭게 공유하세요.
            </Typography>
          </>
        )}
      </Box>

      {/* 게시판 타이틀 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArticleIcon sx={{ color: 'primary.main', fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            전체 게시글
          </Typography>
          {!loading && (
            <Chip
              label={posts.length}
              size="small"
              color="primary"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress color="primary" />
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {posts.map((post) => (
          <Card
            key={post.id}
            elevation={0}
            sx={{
              '&:hover': {
                boxShadow: '0 8px 24px rgba(99,102,241,0.12)',
                transform: 'translateY(-1px)',
                borderColor: 'rgba(99,102,241,0.2)',
              },
            }}
          >
            <CardActionArea onClick={() => navigate(`/posts/${post.id}`)}>
              <Box sx={{ display: 'flex' }}>
                {post.image_url ? (
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: { xs: 90, sm: 130 },
                      alignSelf: 'stretch',
                      overflow: 'hidden',
                      borderRadius: '16px 0 0 16px',
                    }}
                  >
                    <img
                      src={post.image_url}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: { xs: 90, sm: 130 },
                      alignSelf: 'stretch',
                      borderRadius: '16px 0 0 16px',
                      background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ArticleIcon sx={{ fontSize: 36, color: '#a5b4fc' }} />
                  </Box>
                )}

                <CardContent sx={{ flex: 1, py: 2, '&:last-child': { pb: 2 } }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.4, mb: 1 }}
                  >
                    {post.title}
                  </Typography>

                  {post.hashtags?.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                      {post.hashtags.slice(0, 3).map((tag) => (
                        <Chip
                          key={tag}
                          label={`#${tag}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.68rem' }}
                        />
                      ))}
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Avatar
                      sx={{
                        width: 20,
                        height: 20,
                        fontSize: '0.65rem',
                        bgcolor: 'primary.light',
                      }}
                    >
                      {(post.profiles?.username || '?')[0].toUpperCase()}
                    </Avatar>
                    <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {post.profiles?.username || '알 수 없음'}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {new Date(post.created_at).toLocaleDateString('ko-KR')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <ViewIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.disabled">
                          {post.views ?? 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <LikeIcon sx={{ fontSize: 13, color: '#f87171' }} />
                        <Typography variant="caption" color="text.disabled">
                          {post.likes?.[0]?.count ?? 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <CommentIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.disabled">
                          {post.comments?.[0]?.count ?? 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Box>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {!loading && posts.length === 0 && !error && (
        <Box
          sx={{
            textAlign: 'center',
            mt: 6,
            py: 6,
            px: 3,
            bgcolor: '#f8fafc',
            borderRadius: 3,
            border: '1.5px dashed #e2e8f0',
          }}
        >
          <ArticleIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
            아직 게시글이 없습니다
          </Typography>
          <Typography variant="body2" color="text.disabled">
            첫 번째 게시글을 작성해보세요!
          </Typography>
        </Box>
      )}

      {user && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 32, right: 32 }}
          onClick={() => navigate('/write')}
        >
          <AddIcon />
        </Fab>
      )}
    </Layout>
  );
};

export default PostListPage;
