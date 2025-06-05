import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Nature,
  ExitToApp,
  Dashboard,
  Add,
  List,
  Menu as MenuIcon,
  Person
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

interface NavbarProps {
  showUserInfo?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showUserInfo = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleUserMenuClose();
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Dashboard />
    },
    {
      label: 'Cadastrar Local',
      path: '/locais/cadastro',
      icon: <Add />
    },
    {
      label: 'Listar Locais',
      path: '/locais',
      icon: <List />
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const isCurrentPage = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box className="navbar-container">
      <Box className="navbar-content">
        <Box className="navbar-logo-section">
          <Nature className="navbar-logo-icon" />
          <Typography 
            variant="h6" 
            className="navbar-title"
            onClick={() => navigate('/dashboard')}
          >
            Recicla365
          </Typography>
        </Box>

        {!isMobile && (
          <Box className="navbar-menu-desktop">
            {navItems.map((item) => (
              <Button
                key={item.path}
                startIcon={item.icon}
                onClick={() => handleNavigation(item.path)}
                className={`navbar-menu-item ${isCurrentPage(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        <Box className="navbar-user-section">
          {showUserInfo && usuario && !isMobile && (
            <Typography className="navbar-user-name">
              Olá, {usuario.nome.split(' ')[0]}
            </Typography>
          )}

          {isMobile ? (
            <>
              <IconButton
                onClick={handleMenuOpen}
                className="navbar-mobile-menu-button"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                className="navbar-mobile-menu"
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={isCurrentPage(item.path) ? 'active' : ''}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.icon}
                      {item.label}
                    </Box>
                  </MenuItem>
                ))}
                <MenuItem onClick={handleLogout}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ExitToApp />
                    Sair
                  </Box>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {showUserInfo && usuario && (
                <IconButton
                  onClick={handleUserMenuOpen}
                  className="navbar-user-button"
                >
                  <Person />
                </IconButton>
              )}
              
              <Button
                startIcon={<ExitToApp />}
                onClick={handleLogout}
                className="navbar-logout-button"
              >
                {!showUserInfo || !usuario ? 'Sair' : ''}
              </Button>

              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                className="navbar-user-menu"
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="textSecondary">
                    {usuario?.email}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ExitToApp />
                    Sair
                  </Box>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;