import { supabase } from './supabase';

export const getPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(username), comments(count), likes(count)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getPost = async (id) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(username)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const incrementViews = async (id) => {
  await supabase.rpc('increment_post_views', { post_id: id });
};

export const createPost = async (title, content, userId, imageUrl = null, hashtags = []) => {
  const { data, error } = await supabase
    .from('posts')
    .insert({ title, content, user_id: userId, image_url: imageUrl, hashtags })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deletePost = async (id) => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
};

export const seedTestPosts = async (userId) => {
  const { data: existing } = await supabase
    .from('posts')
    .select('id')
    .eq('user_id', userId)
    .limit(1);
  if (existing && existing.length > 0) return;

  await supabase.from('posts').insert([
    {
      user_id: userId,
      title: 'React 컴포넌트 설계 패턴 정리',
      content: 'React에서 자주 사용되는 컴포넌트 설계 패턴을 정리했습니다.\n\n1. Container/Presentational 패턴\n2. Custom Hook 패턴\n3. Compound Component 패턴\n\n각 패턴의 장단점과 사용 사례를 예제 코드와 함께 설명합니다.',
      image_url: 'https://picsum.photos/seed/react2024/800/400',
      hashtags: ['React', '디자인패턴', '프론트엔드'],
    },
    {
      user_id: userId,
      title: 'Supabase로 풀스택 앱 만들기',
      content: 'Supabase를 활용해서 백엔드 없이 풀스택 웹앱을 만드는 방법을 소개합니다.\n\n- 인증(Auth) 설정\n- 데이터베이스 테이블 설계\n- Row Level Security 정책\n- 실시간 구독\n\nFirebase 대안으로 훌륭한 선택입니다!',
      image_url: 'https://picsum.photos/seed/supabase2024/800/400',
      hashtags: ['Supabase', '풀스택', '백엔드'],
    },
    {
      user_id: userId,
      title: 'MUI v7 마이그레이션 후기',
      content: 'MUI v5에서 v7로 마이그레이션한 후기입니다.\n\n주요 변경사항:\n- Grid2 컴포넌트 변경\n- 새로운 테마 시스템\n- 성능 개선\n\n마이그레이션 시 주의할 점과 팁을 공유합니다.',
      image_url: 'https://picsum.photos/seed/mui2024/800/400',
      hashtags: ['MUI', 'React', 'UI라이브러리'],
    },
    {
      user_id: userId,
      title: 'GitHub Actions로 CI/CD 구축하기',
      content: 'GitHub Actions를 활용한 자동화 배포 가이드입니다.\n\n1. 워크플로우 파일 작성\n2. 빌드 & 테스트 자동화\n3. GitHub Pages 자동 배포\n4. 환경 변수 관리\n\n실무에서 바로 적용할 수 있는 예제를 포함합니다.',
      image_url: 'https://picsum.photos/seed/github2024/800/400',
      hashtags: ['GitHub', 'CICD', 'DevOps'],
    },
  ]);
};
