import React from 'react';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'like', user: '먹방킹', message: '회원님의 게시물을 좋아합니다.', time: '2분 전', color: '#E53935' },
  { id: 2, type: 'follow', user: '맛집헌터', message: '회원님을 팔로우하기 시작했습니다.', time: '15분 전', color: '#FF6B35' },
  { id: 3, type: 'comment', user: '푸드러버', message: '"진짜 맛있어 보여요!" 댓글을 달았습니다.', time: '1시간 전', color: '#2196F3' },
  { id: 4, type: 'like', user: '서울미식가', message: '회원님의 게시물을 좋아합니다.', time: '3시간 전', color: '#E53935' },
  { id: 5, type: 'follow', user: '오마카세집사', message: '회원님을 팔로우하기 시작했습니다.', time: '1일 전', color: '#FF6B35' },
  { id: 6, type: 'comment', user: '맛집탐험대', message: '"어디 맛집이에요? 알려주세요!"', time: '2일 전', color: '#2196F3' },
];

const NotificationIcon = ({ type, color }) => {
  if (type === 'like') return <FavoriteIcon sx={{ fontSize: 16, color }} />;
  if (type === 'follow') return <PersonAddIcon sx={{ fontSize: 16, color }} />;
  return <ChatBubbleIcon sx={{ fontSize: 16, color }} />;
};

const NotificationsPage = () => {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Box sx={{ px: 2, py: 2, bgcolor: 'white', borderBottom: '1px solid rgba(255,107,53,0.15)' }}>
        <Typography variant="h6" fontWeight={700}>알림</Typography>
      </Box>

      <List sx={{ bgcolor: 'white', p: 0 }}>
        {MOCK_NOTIFICATIONS.map((notif, i) => (
          <React.Fragment key={notif.id}>
            <ListItem sx={{ py: 1.5, px: 2 }}>
              <ListItemAvatar>
                <Box sx={{ position: 'relative' }}>
                  <Avatar sx={{ bgcolor: '#FFF0E8', color: '#FF6B35', fontWeight: 700 }}>
                    {notif.user[0]}
                  </Avatar>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  >
                    <NotificationIcon type={notif.type} color={notif.color} />
                  </Box>
                </Box>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2">
                    <strong>{notif.user}</strong>{' '}{notif.message}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">{notif.time}</Typography>
                }
              />
            </ListItem>
            {i < MOCK_NOTIFICATIONS.length - 1 && <Divider sx={{ ml: 9 }} />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default NotificationsPage;
