import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button, Chip, Avatar, AvatarGroup, Snackbar } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';

const MOCK_GATHERINGS = [
  {
    id: 1,
    title: '강남 오마카세 탐방 모임',
    location: '강남구 신사동',
    time: '오늘 저녁 7:00 PM',
    current: 3,
    max: 6,
    distance: '0.8km',
    category: '일식',
  },
  {
    id: 2,
    title: '홍대 라멘 투어',
    location: '마포구 서교동',
    time: '내일 오후 12:00 PM',
    current: 5,
    max: 8,
    distance: '1.2km',
    category: '라멘',
  },
  {
    id: 3,
    title: '이태원 브런치 클럽',
    location: '용산구 이태원동',
    time: '토요일 오전 11:00 AM',
    current: 2,
    max: 5,
    distance: '2.1km',
    category: '브런치',
  },
  {
    id: 4,
    title: '을지로 노포 순례',
    location: '중구 을지로3가',
    time: '일요일 오후 6:00 PM',
    current: 7,
    max: 10,
    distance: '3.5km',
    category: '한식',
  },
];

const GatheringPage = () => {
  const navigate = useNavigate();
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');

  const handleJoin = (gathering) => {
    setSnackMsg(`"${gathering.title}" 모임에 참가했습니다!`);
    setSnackOpen(true);
    setTimeout(() => {
      navigate(`/chat/${gathering.id}`, { state: { roomName: gathering.title } });
    }, 800);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', px: 2, py: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>친구 모임 찾기</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <LocationOnIcon sx={{ fontSize: 14, color: '#FF6B35' }} />
          <Typography variant="caption" color="text.secondary">내 위치 기준 5km 이내</Typography>
        </Box>
      </Box>

      {MOCK_GATHERINGS.map((gathering) => (
        <Card key={gathering.id} elevation={0} sx={{ mb: 2, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Chip
                label={gathering.category}
                size="small"
                sx={{ bgcolor: '#FFF0E8', color: '#FF6B35', fontWeight: 600, fontSize: '0.7rem' }}
              />
              <Typography variant="caption" color="text.secondary">{gathering.distance}</Typography>
            </Box>

            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>{gathering.title}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 14, color: '#999' }} />
              <Typography variant="caption" color="text.secondary">{gathering.location}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14, color: '#999' }} />
              <Typography variant="caption" color="text.secondary">{gathering.time}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PeopleIcon sx={{ fontSize: 16, color: '#FF6B35' }} />
                <Typography variant="body2" fontWeight={600} color="primary">
                  {gathering.current}/{gathering.max}명
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                disabled={gathering.current >= gathering.max}
                onClick={() => handleJoin(gathering)}
                sx={{
                  background: gathering.current >= gathering.max
                    ? '#ccc'
                    : 'linear-gradient(135deg, #FF6B35, #FFB347)',
                  boxShadow: 'none',
                  borderRadius: 2,
                  fontSize: '0.75rem',
                }}
              >
                {gathering.current >= gathering.max ? '마감' : '참가하기'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
      <Snackbar
        open={snackOpen}
        autoHideDuration={1500}
        onClose={() => setSnackOpen(false)}
        message={snackMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default GatheringPage;
