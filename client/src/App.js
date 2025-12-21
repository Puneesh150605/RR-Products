import React, { useState, useMemo, useContext } from 'react';
import { CartProvider } from './CartContext';
import { Routes, Route, useLocation, Link as RouterLink, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Stack, IconButton, Tooltip, Avatar, Menu, MenuItem, ListItemIcon, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert } from '@mui/material';
import FactoryRoundedIcon from '@mui/icons-material/FactoryRounded';
import CartDrawer from './CartDrawer';
import CartIconWithBadge from './CartIconWithBadge';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import StockDashboard from './pages/StockDashboard';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 
import { AnimatePresence } from 'framer-motion';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import { ColorModeContext } from './ColorModeContext';
import { AuthProvider, useAuth } from './AuthContext';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner
  return user ? children : <Navigate to="/login" replace state={{ from: window.location }} />;
}

// User Menu Component
function UserMenu({ setLoginModal }) {
    const { user, logout, isAdmin } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    if (!user) {
        return (
            <Stack direction="row" spacing={1}>
                {/* Restored Manager Login */}
                <Button 
                  color="secondary" 
                  variant="outlined" 
                  onClick={()=>setLoginModal(true)}
                  sx={{ 
                    fontWeight: 800,
                    textTransform: 'none',
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2 }
                  }}
                >
                  Manager Login
                </Button>

                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/login"
                  sx={{ fontWeight: 700, textTransform: 'none' }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  component={RouterLink} 
                  to="/signup"
                  sx={{ fontWeight: 700, textTransform: 'none', boxShadow: 'none' }}
                >
                  Sign Up
                </Button>
            </Stack>
        );
    }
    
    return (
        <>
            <Button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                color="inherit"
                startIcon={<Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main' }}>{user.name.charAt(0)}</Avatar>}
                endIcon={null}
                sx={{ 
                    textTransform: 'none', 
                    fontWeight: 700,
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'transparent', color: 'primary.main' }
                 }}
            >
                {user.name.split(' ')[0]}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                onClick={() => setAnchorEl(null)}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {isAdmin && (
                    <MenuItem component={RouterLink} to="/manage">
                        <ListItemIcon><ManageAccountsRoundedIcon fontSize="small" /></ListItemIcon>
                        Manage Stock
                    </MenuItem>
                )}
                 {isAdmin && (
                    <MenuItem component={RouterLink} to="/admin">
                        <ListItemIcon><ManageAccountsRoundedIcon fontSize="small" /></ListItemIcon>
                        Admin Dashboard
                    </MenuItem>
                )}
                <MenuItem onClick={logout}>
                    <ListItemIcon><LogoutRoundedIcon fontSize="small" /></ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
}

function AdminLoginModal({ open, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginLocalAdmin } = useAuth();
  
  const handleSubmit = e => {
    e.preventDefault();
    if (password === 'admin123') {
        loginLocalAdmin();
        setError('');
        setPassword('');
        onClose && onClose();
        // Redirect or refresh might happen via auth check, but state update will trigger re-render
    } else {
      setError('Invalid password!');
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Manager Login</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Admin Password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            fullWidth
            margin="dense"
            type="password"
            autoFocus
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Login</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function App() {
  const [cartDrawer, setCartDrawer] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const location = useLocation();
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  
  return (
    <AuthProvider>
      <CartProvider>
        <AppBar 
          position="sticky" 
          color="inherit" 
          elevation={0}
          sx={{ 
            bgcolor: mode === 'dark' ? 'rgba(11, 18, 32, 0.72)' : 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid',
            borderColor: 'divider',
            boxShadow: mode === 'dark' ? '0 10px 30px rgba(0,0,0,0.45)' : '0 10px 30px rgba(16,24,40,0.08)'
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ py: 1 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
                <FactoryRoundedIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography
                  variant="h5"
                  sx={{ 
                    fontWeight: 900, 
                    letterSpacing: 0.5,
                    background: 'var(--rr-gradient)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                  component={RouterLink}
                  to="/"
                  style={{ textDecoration: 'none' }}
                >
                  RR Products
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <CartIconWithBadge onClick={() => setCartDrawer(true)} />
                <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                  <IconButton onClick={toggleColorMode} color="primary" sx={{ border: '1px solid', borderColor: 'divider' }}>
                    {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
                  </IconButton>
                </Tooltip>
                
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/catalog"
                  sx={{ 
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Catalog
                </Button>
                
                <UserMenu setLoginModal={setLoginModal} /> 
                
              </Stack>
            </Toolbar>
          </Container>
        </AppBar>
        <Box sx={{ minHeight: 'calc(100vh - 64px)' }}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/manage" element={<RequireAuth><StockDashboard /></RequireAuth>} />
              <Route path="/admin" element={<RequireAuth><AdminDashboardPage /></RequireAuth>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </Box>
        <CartDrawer open={cartDrawer} onClose={() => setCartDrawer(false)} />
        <AdminLoginModal open={loginModal} onClose={()=>setLoginModal(false)} />
      </CartProvider>
    </AuthProvider>
  );
}
