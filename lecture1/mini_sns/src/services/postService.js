import { supabase } from './supabase';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

/**
 * Unsplash API를 호출하여 음식 관련 랜덤 이미지 URL을 반환합니다.
 * API 키가 없거나 호출 실패 시 picsum.photos로 폴백합니다.
 */
export const getRandomFoodImage = async (query = 'food') => {
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === '여기에_Unsplash_Access_Key_입력') {
    return `https://picsum.photos/400/400?random=${Date.now()}`;
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=squarish&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    if (!res.ok) throw new Error('Unsplash API 오류');
    const data = await res.json();
    return data.urls.regular;
  } catch {
    return `https://picsum.photos/400/400?random=${Date.now()}`;
  }
};

export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from('sns_posts')
    .select(`
      *,
      users (id, nickname, profile_image_url),
      sns_comments (
        id, content, created_at,
        users (id, nickname)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createPost = async ({ userId, imageUrl, caption, hashtags, location }) => {
  const { data, error } = await supabase
    .from('sns_posts')
    .insert({ user_id: userId, image_url: imageUrl, caption, hashtags, location })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const toggleLike = async ({ postId, userId, currentLiked, currentCount }) => {
  if (currentLiked) {
    await supabase.from('sns_likes').delete().eq('post_id', postId).eq('user_id', userId);
    await supabase.from('sns_posts').update({ like_count: Math.max(0, currentCount - 1) }).eq('id', postId);
    return false;
  } else {
    await supabase.from('sns_likes').insert({ post_id: postId, user_id: userId });
    await supabase.from('sns_posts').update({ like_count: currentCount + 1 }).eq('id', postId);
    return true;
  }
};

export const addComment = async ({ postId, userId, content }) => {
  const { data, error } = await supabase
    .from('sns_comments')
    .insert({ post_id: postId, user_id: userId, content })
    .select(`*, users(id, nickname)`)
    .single();

  if (error) throw error;
  return data;
};

export const deleteComment = async (commentId) => {
  const { error } = await supabase.from('sns_comments').delete().eq('id', commentId);
  if (error) throw error;
};

export const fetchComments = async (postId) => {
  const { data, error } = await supabase
    .from('sns_comments')
    .select(`*, users(id, nickname)`)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const fetchUserPosts = async (userId) => {
  const { data, error } = await supabase
    .from('sns_posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const seedTestPosts = async (userId) => {
  const { data: existing } = await supabase
    .from('sns_posts')
    .select('id')
    .eq('user_id', userId)
    .limit(1);
  if (existing && existing.length > 0) return;

  await supabase.from('sns_posts').insert([
    {
      user_id: userId,
      image_url: 'https://picsum.photos/seed/sushi2024/400/400',
      caption: '오늘의 점심! 한남동 오마카세 🍣 신선한 회가 입에서 녹아요~',
      hashtags: ['오마카세', '한남동맛집', '스시'],
      location: '한남동',
      like_count: 12,
    },
    {
      user_id: userId,
      image_url: 'https://picsum.photos/seed/ramen2024/400/400',
      caption: '홍대 골목 숨은 라멘 맛집 발견! 🍜 진한 돈코츠 육수가 최고',
      hashtags: ['라멘', '홍대맛집', '돈코츠'],
      location: '홍대입구',
      like_count: 8,
    },
    {
      user_id: userId,
      image_url: 'https://picsum.photos/seed/brunch2024/400/400',
      caption: '주말 브런치 타임 ☕ 에그베네딕트와 아메리카노 조합은 진리',
      hashtags: ['브런치', '카페', '주말'],
      location: '이태원',
      like_count: 15,
    },
    {
      user_id: userId,
      image_url: 'https://picsum.photos/seed/korean2024/400/400',
      caption: '을지로 노포 감성 가득한 곰탕집 🍲 40년 전통의 깊은 맛!',
      hashtags: ['한식', '을지로맛집', '곰탕'],
      location: '을지로3가',
      like_count: 20,
    },
  ]);
};

export const getUserLikedPosts = async (userId) => {
  const { data, error } = await supabase
    .from('sns_likes')
    .select('post_id')
    .eq('user_id', userId);

  if (error) return [];
  return data.map(l => l.post_id);
};
