import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box, Typography, TextField, IconButton, Avatar, AppBar, Toolbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../store/AuthContext.jsx';

const ROOM_NAMES = {
  '1': '강남 오마카세 탐방 모임',
  '2': '맛집헌터',
  '3': '홍대 라멘 투어',
  '4': '서울미식가',
};

const MOCK_MESSAGES = [
  { id: 1, sender: '맛집헌터', text: '안녕하세요! 오마카세 모임 참가 신청했어요', isMe: false, time: '오후 6:30' },
  { id: 2, sender: 'me', text: '반갑습니다~ 저도 기대돼요!', isMe: true, time: '오후 6:32' },
  { id: 3, sender: '서울미식가', text: '저도 갈게요 예약은 몇 명으로 했나요?', isMe: false, time: '오후 6:45' },
  { id: 4, sender: 'me', text: '총 6명 예약했어요', isMe: true, time: '오후 6:47' },
  { id: 5, sender: '맛집헌터', text: '완벽하네요! 기대됩니다', isMe: false, time: '오후 7:00' },
];

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [text, setText] = useState('');

  const location = useLocation();
  const roomName = location.state?.roomName || ROOM_NAMES[roomId] || '채팅방';

  const handleSend = () => {
    if (!text.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: user?.nickname || 'me',
      text: text.trim(),
      isMe: true,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setText('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#FFF8F5' }}>
      {/* 상단바 */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid rgba(255,107,53,0.15)' }}>
        <Toolbar sx={{ minHeight: 56 }}>
          <IconButton onClick={() => navigate('/chat')} sx={{ color: '#FF6B35', mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF6B35', mr: 1, fontSize: '0.9rem' }}>
            {roomName[0]}
          </Avatar>
          <Typography variant="body1" fontWeight={700} color="text.primary" noWrap>
            {roomName}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 메시지 목록 */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.isMe ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: 1,
            }}
          >
            {!msg.isMe && (
              <Avatar sx={{ width: 30, height: 30, bgcolor: '#FFB347', fontSize: '0.75rem' }}>
                {msg.sender[0]}
              </Avatar>
            )}
            <Box sx={{ maxWidth: '70%' }}>
              {!msg.isMe && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>{msg.sender}</Typography>
              )}
              <Box
                sx={{
                  bgcolor: msg.isMe ? '#FF6B35' : 'white',
                  color: msg.isMe ? 'white' : 'text.primary',
                  px: 1.5,
                  py: 1,
                  borderRadius: msg.isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3, textAlign: msg.isMe ? 'right' : 'left' }}>
                {msg.time}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* 입력란 */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: 'white',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="메시지 입력..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!text.trim()}
          sx={{
            bgcolor: '#FF6B35',
            color: 'white',
            '&:hover': { bgcolor: '#E55A28' },
            '&.Mui-disabled': { bgcolor: '#ccc', color: 'white' },
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatRoomPage;
