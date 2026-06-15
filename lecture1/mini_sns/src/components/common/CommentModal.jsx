import React, { useState, useEffect } from 'react';
import {
  SwipeableDrawer, Box, Typography, TextField, Button,
  Avatar, Divider, CircularProgress, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { fetchComments, addComment, deleteComment } from '../../services/postService';
import { useAuth } from '../../store/AuthContext.jsx';

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
};

const CommentModal = ({ open, onClose, postId, onCommentAdded }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && postId) {
      setLoading(true);
      fetchComments(postId)
        .then(setComments)
        .finally(() => setLoading(false));
    }
  }, [open, postId]);

  const handleSubmit = async () => {
    if (!text.trim() || !user) return;
    setSubmitting(true);
    try {
      const newComment = await addComment({ postId, userId: user.id, content: text.trim() });
      setComments(prev => [...prev, newComment]);
      setText('');
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen
      PaperProps={{
        sx: {
          maxWidth: 480,
          mx: 'auto',
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: '16px 16px 0 0',
          maxHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* 헤더 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pb: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 600 }}>댓글</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </Box>
      <Divider />

      {/* 댓글 목록 */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} color="primary" />
          </Box>
        ) : comments.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            첫 번째 댓글을 남겨보세요!
          </Typography>
        ) : (
          comments.map((comment) => (
            <Box key={comment.id} sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF6B35', fontSize: '0.8rem' }}>
                {comment.users?.nickname?.[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                  <Typography variant="body2" fontWeight={600}>{comment.users?.nickname}</Typography>
                  <Typography variant="caption" color="text.secondary">{formatTime(comment.created_at)}</Typography>
                </Box>
                <Typography variant="body2">{comment.content}</Typography>
              </Box>
              {user && user.id === comment.user_id && (
                <IconButton
                  size="small"
                  onClick={() => handleDelete(comment.id)}
                  sx={{ color: '#999', '&:hover': { color: '#E53935' } }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}
            </Box>
          ))
        )}
      </Box>

      {/* 댓글 입력 */}
      <Divider />
      <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="댓글 달기..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
        <IconButton
          onClick={handleSubmit}
          disabled={!text.trim() || submitting}
          sx={{ color: '#FF6B35' }}
        >
          {submitting ? <CircularProgress size={20} /> : <SendIcon />}
        </IconButton>
      </Box>
    </SwipeableDrawer>
  );
};

export default CommentModal;
