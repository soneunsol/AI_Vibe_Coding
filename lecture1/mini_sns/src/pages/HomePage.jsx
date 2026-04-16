import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import PostCard from '../components/common/PostCard.jsx';
import { fetchPosts, getUserLikedPosts } from '../services/postService';
import { useAuth } from '../store/AuthContext.jsx';

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [likedPostIds, setLikedPostIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [postsData, likedIds] = await Promise.all([
        fetchPosts(),
        user ? getUserLikedPosts(user.id) : Promise.resolve([]),
      ]);
      setPosts(postsData || []);
      setLikedPostIds(likedIds || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F5EDE8' }}>
      {posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
          <Typography sx={{ mb: 1, fontSize: '3rem' }}>🍽️</Typography>
          <Typography variant="h6" color="text.secondary">아직 게시물이 없어요</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            첫 번째 맛집을 공유해보세요!
          </Typography>
        </Box>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            likedPostIds={likedPostIds}
            onLikeChange={loadData}
          />
        ))
      )}
    </Box>
  );
};

export default HomePage;
