import { useState, useEffect } from 'react';
import {
  Typography, Box, Card, CardContent, Divider,
  TextField, Button, CircularProgress, Alert, IconButton, Chip, Avatar,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { getPost, deletePost, incrementViews } from '../services/postService';
import { getComments, createComment, deleteComment } from '../services/commentService';
import { getLikes, addLike, removeLike } from '../services/likeService';
import useAuth from '../hooks/useAuth';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    Promise.all([getPost(id), getComments(id), getLikes(id)])
      .then(([postData, commentsData, likesData]) => {
        setPost(postData);
        setComments(commentsData);
        setLikes(likesData);
        incrementViews(id);
      })
      .catch(() => setError('게시글을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [id]);

  const isLiked = user ? likes.some((l) => l.user_id === user.id) : false;

  const handleToggleLike = async () => {
    if (!user) { navigate('/login'); return; }
    setLikeLoading(true);
    try {
      if (isLiked) {
        await removeLike(id, user.id);
        setLikes((prev) => prev.filter((l) => l.user_id !== user.id));
      } else {
        await addLike(id, user.id);
        setLikes((prev) => [...prev, { user_id: user.id }]);
      }
    } catch (err) {
      setError('좋아요 처리에 실패했습니다. (RLS 정책을 확인해주세요)');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
    await deletePost(id);
    navigate('/');
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const comment = await createComment(newComment, id, user.id);
      setComments((prev) => [...prev, comment]);
      setNewComment('');
    } catch {
      setError('댓글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  if (loading) return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    </Layout>
  );
  if (error) return <Layout><Alert severity="error">{error}</Alert></Layout>;

  return (
    <Layout>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2.5, color: 'text.secondary', fontWeight: 500 }}
      >
        목록으로
      </Button>

      {/* 게시글 카드 */}
      <Card elevation={0} sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          {/* 제목 + 삭제 버튼 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, flex: 1, lineHeight: 1.4, color: 'text.primary' }}>
              {post.title}
            </Typography>
            {user?.id === post.user_id && (
              <IconButton
                color="error"
                onClick={handleDeletePost}
                size="small"
                sx={{ ml: 1, flexShrink: 0 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {/* 작성자 정보 */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, alignItems: 'center' }}>
            <Avatar
              sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'primary.light' }}
            >
              {(post.profiles?.username || '?')[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2, color: 'text.primary' }}>
                {post.profiles?.username || '알 수 없음'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(post.created_at).toLocaleString('ko-KR')}
              </Typography>
            </Box>
          </Box>

          {/* 해시태그 */}
          {post.hashtags?.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mb: 2.5, flexWrap: 'wrap' }}>
              {post.hashtags.map((tag) => (
                <Chip key={tag} label={`#${tag}`} size="small" color="primary" variant="outlined" />
              ))}
            </Box>
          )}

          <Divider sx={{ mb: 2.5 }} />

          {/* 이미지 */}
          {post.image_url && (
            <Box sx={{ mb: 2.5, borderRadius: 2, overflow: 'hidden' }}>
              <img
                src={post.image_url}
                alt="게시글 이미지"
                style={{ width: '100%', maxWidth: 640, borderRadius: 12, display: 'block' }}
              />
            </Box>
          )}

          {/* 본문 */}
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'text.primary' }}
          >
            {post.content}
          </Typography>

          {/* 좋아요 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 3,
              pt: 2.5,
              borderTop: '1px solid #f1f5f9',
              gap: 1,
            }}
          >
            <IconButton
              onClick={handleToggleLike}
              disabled={likeLoading}
              sx={{
                color: isLiked ? '#ef4444' : 'text.disabled',
                bgcolor: isLiked ? 'rgba(239,68,68,0.08)' : 'transparent',
                border: '1.5px solid',
                borderColor: isLiked ? 'rgba(239,68,68,0.3)' : '#e2e8f0',
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                gap: 0.5,
                '&:hover': {
                  bgcolor: isLiked ? 'rgba(239,68,68,0.12)' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              <Typography variant="body2" sx={{ fontWeight: 600, ml: 0.5 }}>
                {likes.length}
              </Typography>
            </IconButton>
            {!user && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                로그인 후 좋아요를 누를 수 있어요
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* 댓글 섹션 */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CommentIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            댓글
          </Typography>
          <Chip
            label={comments.length}
            size="small"
            color="primary"
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2.5 }}>
          {comments.map((comment) => (
            <Card key={comment.id} elevation={0} sx={{ bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.65rem', bgcolor: 'primary.light' }}>
                      {(comment.profiles?.username || '?')[0].toUpperCase()}
                    </Avatar>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {comment.profiles?.username || '알 수 없음'}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {new Date(comment.created_at).toLocaleString('ko-KR')}
                    </Typography>
                  </Box>
                  {user?.id === comment.user_id && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteComment(comment.id)}
                      sx={{ p: 0.3 }}
                    >
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="body2" sx={{ mt: 0.8, color: 'text.primary', lineHeight: 1.6 }}>
                  {comment.content}
                </Typography>
              </CardContent>
            </Card>
          ))}

          {comments.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 3, color: 'text.disabled' }}>
              <Typography variant="body2">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</Typography>
            </Box>
          )}
        </Box>

        {/* 댓글 입력 */}
        {user ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
            />
            <Button
              variant="contained"
              onClick={handleAddComment}
              disabled={submitting || !newComment.trim()}
              sx={{ whiteSpace: 'nowrap', px: 2.5 }}
            >
              등록
            </Button>
          </Box>
        ) : (
          <Alert
            severity="info"
            sx={{ alignItems: 'center' }}
            action={
              <Button size="small" color="primary" variant="outlined" onClick={() => navigate('/login')}>
                로그인
              </Button>
            }
          >
            댓글을 작성하려면 로그인이 필요합니다.
          </Alert>
        )}
      </Box>
    </Layout>
  );
};

export default PostDetailPage;
