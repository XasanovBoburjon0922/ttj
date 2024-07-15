import React, { useState, useEffect, useMemo } from 'react';
import { Button, Dropdown, Layout, Menu, Card, Switch, Radio, Modal, Typography, Space, Slider } from 'antd';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon, Group } from '@mui/icons-material';
import { createTheme, ThemeProvider, Box, IconButton } from '@mui/material';
import {
  HomeOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
  LogoutOutlined,
  AreaChartOutlined,
  TagsOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import Attendance from './Honalar';
import AttendanceRecords from './Calendar';
import Statistics from './Statistic';
import { useTranslation } from 'react-i18next';
import './i18next';
import Groups from './Groups';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [students, setStudents] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [language, setLanguage] = useState<'uzb' | 'eng' | 'rus'>('uzb');
  const [menuOrientation, setMenuOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://nbtuit.pythonanywhere.com/api/v1/auth/students/');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchData();

    const storedUsername = window.localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds} | ${day}-${month}-${year}`;
  };

  const handleMenuClick = (e: any) => {
    setSelectedMenuItem(e.key);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('username');
    window.location.reload();
  };

  const menu = (
    <Menu>
      <Menu.Item key="username">
        <UserOutlined />
        {username}
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined />
        {t('Logout')}
      </Menu.Item>
    </Menu>
  );

  const renderContent = () => {
    switch (selectedMenuItem) {
      case '3':
        return <AttendanceRecords />;
      case '2':
        return <div>{t('Settings')}</div>;
      case '6':
      default:
        return <Attendance setStudents={setStudents} students={students} />;
      case '5':
        return <Statistics />;
      case '4':
        return <Groups/>;
      case '1':
        return <div>{t('Home')}</div>;
      case '7':
        return <div>{t('Applications')}</div>;
    }
  };

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1976d2' : '#90caf9',
          },
          background: {
            default: mode === 'light' ? '#f0f2f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#000000' : '#ffffff',
          },
        },
      }),
    [mode]
  );

  const handleLanguageChange = ({ key }: any) => {
    setLanguage(key);
    i18n.changeLanguage(key);
  };

  const languageMenu = (
    <Menu onClick={handleLanguageChange}>
      <Menu.Item key="uzb">O'zbekcha</Menu.Item>
      <Menu.Item key="rus">Русский</Menu.Item>
      <Menu.Item key="eng">English</Menu.Item>
    </Menu>
  );

  const renderCards = () => {
    const cardData = [
      { key: '6', title: t("Attendance"), img: "/yoqlama.svg" },
      { key: '3', title: t("Attendance Records"), img: "/davomat.svg" },
      { key: '4', title: t("Groups"), img: "/group.svg" },
      { key: '5', title: t("Statistics"), img: "/statistika.svg" },
      { key: '7', title: t("Applications"), img: "/ariza.svg" },
    ];

    return (
      <div className="flex justify-between mt-[50px]">
        {cardData.map(card => (
          <Card
            key={card.key}
            onClick={() => setSelectedMenuItem(card.key)}
            style={{
              cursor: 'pointer',
              backgroundColor: selectedMenuItem === card.key ? theme.palette.primary.main : theme.palette.background.paper,
              color: selectedMenuItem === card.key ? theme.palette.primary.contrastText : theme.palette.text.primary,
              borderColor: selectedMenuItem === card.key ? theme.palette.primary.main : theme.palette.background.default,
              borderWidth: selectedMenuItem === card.key ? '2px' : '1px',
              transition: 'all 0.3s ease',
              boxShadow: selectedMenuItem === card.key ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
            }}
          >
            <div className='flex flex-col justify-center gap-[20px] items-center w-[150px]'>
              <img src={card.img} alt="" width={50} />
              <h2>{card.title}</h2>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const showThemeCustomizer = () => {
    setThemeModalVisible(true);
  };

  const handleThemeModalOk = () => {
    setThemeModalVisible(false);
  };

  const handleThemeModalCancel = () => {
    setThemeModalVisible(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className=' h-[100vh] flex flex-col' style={{ background: theme.palette.background.default, color: theme.palette.text.primary }}>
        <div className='px-[23px] flex justify-between items-center shadow-2xl mb-[1px] shadow-gray-500'>
          <div className='flex items-center'>
            <a href='#' className='flex items-center gap-[20px]'>
              <img src="/Logotip.png" alt="Logo" />
              <h2 className='font-bold text-gray-700'>TUIT NF</h2>
            </a>
          </div>
          <div className='flex'>
            <img src="/time.svg" alt="" />
            <span className='ml-2 text-gray-400'>{formatDate(currentTime)}</span>
          </div>
          <div className='pr-[40px] flex items-center'>
            <Dropdown overlay={languageMenu} trigger={['click']}>
              <Button className="ant-dropdown-link h-[30px] w-[30px] rounded-[50%]" onClick={e => e.preventDefault()}>
                {language === 'uzb' ? (<img src='/Uzbek.svg' className='w-[20px] rounded-md h-[20px]' />) : language === 'rus' ? (<img src='/Rus.svg' className='w-[70%] rounded-md h-[70%]' />) : (<img src='/English.svg' className='w-[70%] rounded-md h-[70%]' />)}
              </Button>
            </Dropdown>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                color: 'text.primary',
                borderRadius: 1,
                p: 1,
              }}
            >
              <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
            {username && (
              <Dropdown
                overlay={menu}
                trigger={['click']}
                visible={dropdownVisible}
                onVisibleChange={(flag) => setDropdownVisible(flag)}
              >
                <Button shape="circle" onClick={() => setDropdownVisible(!dropdownVisible)}>
                  <UserOutlined />
                </Button>
              </Dropdown>
            )}
            <Button onClick={showThemeCustomizer} className="ml-4">
              {t('Theme Customizer')}
            </Button>
          </div>
        </div>
        <Modal
          title={t('Theme Customizer')}
          visible={themeModalVisible}
          onOk={handleThemeModalOk}
          onCancel={handleThemeModalCancel}
          footer={null}
        >
          <Space direction="vertical" size="middle">
            <div className="flex items-center gap-4">
              <Title level={5}>{t('Menu Orientation')}</Title>
              <Radio.Group value={menuOrientation} onChange={e => setMenuOrientation(e.target.value)}>
                <Radio.Button value="vertical">{t('Vertical')}</Radio.Button>
                <Radio.Button value="horizontal">{t('Horizontal')}</Radio.Button>
              </Radio.Group>
            </div>
            <div className="flex items-center gap-4">
              <Title level={5}>{t('Dark Mode')}</Title>
              <Switch checked={mode === 'dark'} onChange={colorMode.toggleColorMode} />
            </div>
          </Space>
        </Modal>
        <div className='flex flex-col'>
          <Layout className='flex flex-col'>
            {menuOrientation === 'vertical' ? (
              <div className='flex'>
                <Sider trigger={null} collapsible collapsed={collapsed} theme="light" style={{ background: theme.palette.background.paper, transition: 'all 0.3s ease' }}>
                  <Menu
                    mode="inline"
                    selectedKeys={[selectedMenuItem]}
                    onClick={handleMenuClick}
                    // style={{ background: theme.palette.background.paper, color: theme.palette.text.primary }}
                    theme={theme.palette.mode === 'dark' ? 'dark' : 'light'}
                  >
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                      {t('Home')}
                    </Menu.Item>
                    <Menu.Item key="6" icon={<TagsOutlined />}>
                      {t('Attendance')}
                    </Menu.Item>
                    <Menu.Item key="3" icon={<AreaChartOutlined />}>
                      {t('Attendance Records')}
                    </Menu.Item>
                    <Menu.Item key="5" icon={<SettingOutlined />}>
                      {t('Statistics')}
                    </Menu.Item>
                    <Menu.Item key="4" icon={<SettingOutlined />}>
                      {t('Groups')}
                    </Menu.Item>
                    <Menu.Item key="7" icon={<UploadOutlined />}>
                      {t('Applications')}
                    </Menu.Item>
                    <Menu.Item key="2" icon={<SettingOutlined />}>
                      {t('Settings')}
                    </Menu.Item>
                  </Menu>
                  <Button
                    className='absolute top-[-50px] right-[-125px]'
                    type="text"
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                      fontSize: '16px',
                      width: 44,
                      height: 44,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  </Button>
                </Sider>
                <div className='w-[100%]'>
                  <Content
                    style={{
                      margin: '0',
                      padding: 24,
                      minHeight: `100%`,
                      display: 'block',
                      background: theme.palette.background.default,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {selectedMenuItem === '1' ? renderCards() : renderContent()}
                  </Content>
                </div>
              </div>
            ) : (
              <>
                <Menu
                  className='flex justify-center'
                  theme={theme.palette.mode === 'dark' ? 'dark' : 'light'}
                  mode="horizontal"
                  selectedKeys={[selectedMenuItem]}
                  onClick={handleMenuClick}
                >
                  <Menu.Item key="1" icon={<HomeOutlined />}>
                    <strong>{t("Home")}</strong>
                  </Menu.Item>
                  <Menu.Item key="6" icon={<img src='/yoqlama.svg' />}>
                    <strong>{t("Attendance")}</strong>
                  </Menu.Item>
                  <Menu.Item key="2" icon={<SettingOutlined />}>
                    <strong>{t("Settings")}</strong>
                  </Menu.Item>
                  <Menu.Item key="3" icon={<UploadOutlined />}>
                    <strong>{t("Attendance Records")}</strong>
                  </Menu.Item>
                  <Menu.Item key="4" icon={<TagsOutlined />}>
                    <strong>{t("Groups")}</strong>
                  </Menu.Item>
                  <Menu.Item key="5" icon={<AreaChartOutlined />}>
                    <strong>{t("Statistics")}</strong>
                  </Menu.Item>
                  <Menu.Item key="7" icon={<AreaChartOutlined />}>
                    <strong>{t("Applications")}</strong>
                  </Menu.Item>
                </Menu>
                <Content
                  style={{
                    margin: '0',
                    padding: 24,
                    minHeight: 280,
                    display: 'block',
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary,
                  }}
                >
                  {selectedMenuItem === '1' ? renderCards() : renderContent()}
                </Content>
              </>
            )}
          </Layout>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
