import { supabase } from './supabase';

// 간단한 해시 함수 (프로덕션에서는 bcrypt 등 사용 권장)
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

const getRandomProfileImage = () => {
  const seed = Math.random().toString(36).substring(7);
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
};

export const signUp = async ({ username, password, nickname }) => {
  // 중복 확인
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .or(`username.eq.${username},nickname.eq.${nickname}`)
    .maybeSingle();

  if (existing) throw new Error('이미 사용 중인 아이디 또는 닉네임입니다.');

  const passwordHash = simpleHash(password);
  const profileImageUrl = getRandomProfileImage();

  const { data, error } = await supabase
    .from('users')
    .insert({ username, password_hash: passwordHash, nickname, profile_image_url: profileImageUrl })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const signIn = async ({ username, password }) => {
  const passwordHash = simpleHash(password);

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password_hash', passwordHash)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');

  // 세션 저장
  localStorage.setItem('matsagram_user', JSON.stringify(data));
  return data;
};

export const signOut = () => {
  localStorage.removeItem('matsagram_user');
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem('matsagram_user');
  return stored ? JSON.parse(stored) : null;
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  localStorage.setItem('matsagram_user', JSON.stringify(data));
  return data;
};
