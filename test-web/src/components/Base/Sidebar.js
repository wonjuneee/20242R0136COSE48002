import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
// import mui component
import {
  ListItemButton,
  Button,
  ListItemIcon,
  Typography,
  ListItemText,
  List,
  IconButton,
  Toolbar,
  Tooltip,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
// import icons
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';

import DeeplantLong from '../../src_assets/Deeplant_long.webp';
import LOGO from '../../src_assets/LOGO.png';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const mainListItems = [
  {
    label: '홈',
    icon: <HomeIcon sx={{ fontSize: 30 }} />,
    path: '/Home',
  },
  {
    label: '대시보드',
    icon: <DataThresholdingIcon sx={{ fontSize: 30 }} />,
    path: '/DataManage',
  },
  {
    label: '데이터 예측',
    icon: <TroubleshootIcon style={{ fontSize: 30 }} />,
    path: '/PA',
  },
  {
    label: '통계 분석',
    icon: <StackedLineChartIcon sx={{ fontSize: 30 }} />,
    path: '/stats',
  },
  {
    label: '사용자 관리',
    icon: <GroupIcon sx={{ fontSize: 30 }} />,
    path: '/UserManagement',
  },
];

// const drawerWidth = `${(345 / 1920) * 100}vw`; // Width when drawer is open
const drawerWidth = '345px'; // Width when drawer is open
const defaultTheme = createTheme();

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF', //사이드바 배경
    boxShadow: `${(5 / 1920) * 100}vw 0px ${(30 / 1080) * 100}vh 0px rgba(238, 238, 238, 0.50)`, // 사이드바 그림자
    overflowX: 'hidden',
    ...(!open && {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: '64px', // 고정된 너비 설정
      [theme.breakpoints.up('sm')]: {
        width: '64px', // sm 브레이크포인트 이상에서도 동일한 너비 유지
      },
    }),
  },
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#FFFFFF',
  boxShadow: 'none',
  minHeight: `${(90 / 1080) * 100}vh`,
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const UserInfo = JSON.parse(localStorage.getItem('UserInfo'));
  const userEmail = UserInfo.userId;
  console.log(userEmail);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const logout = async () => {
    try {
      // const response = await fetch(
      //   `http://${apiIP}/user/logout?id=${userEmail}`
      // );
      // const auth = getAuth();
      // await signOut(auth);
      // console.log(response);
      localStorage.setItem('isLoggedIn', 'false');
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {}, [location]);

  const createFilterQueryParams = () => {
    const queryParams = new URLSearchParams(location.search); // 현재 쿼리 파라미터를 복사
    return queryParams.toString();
  };

  const handleListItemClick = (item) => {
    if (item.label === '사용자 관리' && UserInfo.type !== 'Manager') {
      setSnackbarMessage('권한이 없습니다');
      setSnackbarOpen(true);
    } else {
      navigate(item.path);
      if (item.label !== '홈' && item.label !== '사용자 관리') {
        const queryParams = createFilterQueryParams();
        navigate(`${item.path}?${queryParams}`);
      }
      //const queryParams = createFilterQueryParams();
      //navigate(`${item.path}?${queryParams}`);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
            ...(open && { minHeight: '120px' }), // 열렸을 때 Toolbar 높이 증가
          }}
        >
          <IconButton
            edge="start"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <img src={LOGO} alt="LOGO" />
          </IconButton>
          <Typography sx={{ flexGrow: 1 }}>
            {open && (
              <Link to="/Home">
                <img src={DeeplantLong} alt="Deeplant Logo" />
              </Link>
            )}
          </Typography>
          <IconButton onClick={() => navigate('/profile')}>
            <div
              style={{
                backgroundColor: '#E8E8E8',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                marginRight: '10px',
              }}
            >
              <PersonOutlineOutlinedIcon
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            {UserInfo && UserInfo.name ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <Typography
                  component="h1"
                  variant="h6"
                  noWrap
                  sx={{ flexGrow: 1, color: 'black', fontSize: '21px' }}
                >
                  {UserInfo.name}
                </Typography>
                <Typography
                  component="h1"
                  variant="h6"
                  noWrap
                  sx={{ flexGrow: 1, fontSize: '11px' }}
                >
                  {UserInfo.type}
                </Typography>
              </div>
            ) : (
              <Typography component="span" variant="body1" sx={{ flexGrow: 1 }}>
                로그인 필요
              </Typography>
            )}
          </IconButton>
          <IconButton onClick={logout}>
            <div
              style={{
                backgroundColor: '#E8E8E8',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                marginRight: '10px',
              }}
            >
              <LogoutIcon style={{ width: '100%', height: '100%' }} />
            </div>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar />
        <List
          component="nav"
          sx={{
            pt: '14px', // 홈 버튼에만 추가 상단 패딩
            pb: '12px', // 홈 버튼에만 추가 하단 패딩
            ...(open && { mt: '8px' }), // 열렸을 때 추가 상단 여백
          }}
        >
          {mainListItems.map((item) => (
            <Tooltip
              title={item.label}
              placement="right"
              arrow
              key={item.label}
            >
              <ListItemButton
                component="div"
                onClick={() => handleListItemClick(item)}
                selected={location.pathname === item.path}
                sx={{
                  ...(location.pathname === item.path && {
                    '& .MuiSvgIcon-root, .MuiTypography-root': {
                      color: '#FFFFFF',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#7BD758',
                    },
                  }),
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <Button onClick={() => {}}>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ color: 'textPrimary' }}
                  />
                </Button>
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1.2],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Toolbar>
      </Drawer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

Sidebar.propTypes = {
  width: PropTypes.number,
};

export default Sidebar;
