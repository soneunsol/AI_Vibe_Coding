import React, { useState } from 'react';
import {
  Box, Avatar, Typography, IconButton, Chip,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../store/AuthContext.jsx';
import CommentModal from './CommentModal.jsx';

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
};

const PostCard = ({ post, likedPostIds = [], onLikeChange }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(likedPostIds.includes(post.id));
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [commentOpen, setCommentOpen] = useState(false);
  const comments = post.sns_comments || post.comments || [];
  const [commentCount, setCommentCount] = useState(comments.length);

  const recentComments = comments.slice(-2);

  const handleLike = async () => {
    if (!user) return;
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    setLiked(newLiked);
    setLikeCount(newCount);

    if (newLiked) {
      await supabase.from('sns_likes').insert({ post_id: post.id, user_id: user.id });
      await supabase.from('sns_posts').update({ like_count: newCount }).eq('id', post.id);
    } else {
      await supabase.from('sns_likes').delete().eq('post_id', post.id).eq('user_id', user.id);
      await supabase.from('sns_posts').update({ like_count: newCount }).eq('id', post.id);
    }
    if (onLikeChange) onLikeChange();
  };

  const hashtags = post.hashtags || [];

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 0,
        overflow: 'hidden',
        borderBottom: '8px solid #F5EDE8',
      }}
    >
      {/* 상단: 프로필 + 닉네임 + 위치 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, gap: 1 }}>
        <Avatar
          src={post.users?.profile_image_url}
          sx={{ width: 40, height: 40, border: '2px solid #FF6B35' }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight={700}>{post.users?.nickname}</Typography>
          {post.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <LocationOnIcon sx={{ fontSize: 12, color: '#FF6B35' }} />
              <Typography variant="caption" color="text.secondary">{post.location}</Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* 중단: 이미지 */}
      <Box
        component="img"
        src={post.image_url}
        alt="음식 이미지"
        sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
        onError={(e) => { e.target.src = `https://picsum.photos/400/400?random=${post.id}`; }}
      />

      {/* 캡션 + 해시태그 */}
      <Box sx={{ px: 2, pt: 1 }}>
        {post.caption && (
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>{post.users?.nickname}</strong>{' '}{post.caption}
          </Typography>
        )}
        {hashtags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
            {hashtags.map((tag, i) => (
              <Typography key={i} variant="caption" sx={{ color: '#FF6B35', fontWeight: 500 }}>
                #{tag}
              </Typography>
            ))}
          </Box>
        )}
        <Typography variant="caption" color="text.secondary">{formatTime(post.created_at)}</Typography>
      </Box>

      {/* 하단: 좋아요/댓글 */}
      <Box sx={{ px: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleLike} sx={{ color: liked ? '#E53935' : '#666', p: 1 }}>
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>{likeCount}</Typography>
          <IconButton onClick={() => setCommentOpen(true)} sx={{ color: '#666', p: 1 }}>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="body2" fontWeight={600}>{commentCount}</Typography>
        </Box>

        {/* 최근 댓글 2개 */}
        {recentComments.length > 0 && (
          <Box sx={{ px: 1 }}>
            {recentComments.map((c) => (
              <Typography key={c.id} variant="caption" display="block" sx={{ color: '#333' }}>
                <strong>{c.users?.nickname}</strong> {c.content}
              </Typography>
            ))}
          </Box>
        )}
      </Box>

      <CommentModal
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        postId={post.id}
        onCommentAdded={() => setCommentCount(prev => prev + 1)}
      />
    </Box>
  );
};

export default PostCard;
