import { supabase } from './supabase';

// 아이디로 내부 이메일 자동 생성 (Supabase auth 요구사항 대응)
const toFakeEmail = (username) => `${username}@devdesignhub.app`;

export const signUp = async (username, password) => {
  const email = toFakeEmail(username);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (error) throw error;
  return data;
};

// 아이디(username)로 이메일 조회 후 로그인
export const signIn = async (username, password) => {
  // DB RPC로 username → email 조회
  const { data: email, error: rpcError } = await supabase.rpc('get_email_by_username', {
    p_username: username,
  });

  if (rpcError || !email) {
    throw new Error('존재하지 않는 아이디입니다.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const resendConfirmationEmail = async (username) => {
  const { data: email, error: rpcError } = await supabase.rpc('get_email_by_username', {
    p_username: username,
  });
  if (rpcError || !email) throw new Error('존재하지 않는 아이디입니다.');

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: getRedirectTo() },
  });
  if (error) throw error;
};

export const checkUsernameAvailable = async (username) => {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();
  return !data;
};
