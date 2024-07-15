import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import {
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';

const Header: React.FC<{ username: string; handleLogout: () => void }> = ({ username, handleLogout }) => {
  return (
    <AppBar position="fixed" style={{ backgroundColor: '#fff', color: '#000' }}>
      <Toolbar>
        <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
          <img src="/path-to-your-logo.png" alt="Logo" style={{ height: '40px' }} />
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body1" style={{ marginRight: '16px' }}>
            {username}
          </Typography>
          <IconButton color="inherit">
            <PersonIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
