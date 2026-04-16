import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, List, ListItem, ListItemAvatar, Avatar,
  ListItemText, Divider, Chip, Badge,
} from '@mui/material';

const MOCK_CHAT_ROOMS = [
  {
    id: '1',
    name: '강남 오마카세 탐방 모임',
    type: 'group',
    lastMessage: '저도 갈게요!',
    time: '오후 7:32',
    unread: 3,
    participants: 4,
  },
  {
    id: '2',
    name: '맛집헌터',
    type: 'direct',
    lastMessage: '그 식당 영업시간이 어떻게 돼요?',
    time: '오후 2:15',
    unread: 1,
    participants: 2,
  },
  {
    id: '3',
    name: '홍대 라멘 투어',
    type: 'group',
    lastMessage: '집합 장소 알려드립니다',
    time: '어제',
    unread: 0,
    participants: 6,
  },
  {
    id: '4',
    name: '서울미식가',
    type: 'direct',
    lastMessage: '맛집 추천 감사해요 ㅎㅎ',
    time: '어제',
    unread: 0,
    participants: 2,
  },
];

const ChatPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Box sx={{ px: 2, py: 2, bgcolor: 'white', borderBottom: '1px solid rgba(255,107,53,0.15)' }}>
        <Typography variant="h6" fontWeight={700}>채팅</Typography>
      </Box>

      <List sx={{ bgcolor: 'white', p: 0 }}>
        {MOCK_CHAT_ROOMS.map((room, i) => (
          <React.Fragment key={room.id}>
            <ListItem
              sx={{ py: 1.5, px: 2, cursor: 'pointer', '&:hover': { bgcolor: '#FFF8F5' } }}
              onClick={() => navigate(`/chat/${room.id}`)}
            >
              <ListItemAvatar>
                <Badge badgeContent={room.unread || null} color="error">
                  <Avatar sx={{ bgcolor: room.type === 'group' ? '#FF6B35' : '#FFB347', fontWeight: 700 }}>
                    {room.name[0]}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={700}>{room.name}</Typography>
                    {room.type === 'group' && (
                      <Chip label={`${room.participants}`} size="small" sx={{ height: 16, fontSize: '0.65rem', bgcolor: '#f0f0f0' }} />
                    )}
                  </Box>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary" noWrap>{room.lastMessage}</Typography>
                }
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, whiteSpace: 'nowrap' }}>
                {room.time}
              </Typography>
            </ListItem>
            {i < MOCK_CHAT_ROOMS.length - 1 && <Divider sx={{ ml: 9 }} />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ChatPage;
