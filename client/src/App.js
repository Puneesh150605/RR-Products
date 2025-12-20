import React, { useState, useMemo, createContext, useContext, useEffect } from 'react';
import { CartProvider } from './CartContext';
import { Routes, Route, useLocation, Link as RouterLink, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Stack, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert, IconButton, Tooltip } from '@mui/material';
import FactoryRoundedIcon from '@mui/icons-material/FactoryRounded';
import CartDrawer from './CartDrawer';
import CartIconWithBadge from './CartIconWithBadge';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import StockDashboard from './pages/StockDashboard';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import { AnimatePresence } from 'framer-motion';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { ColorModeContext } from './ColorModeContext';

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuth, setAuth] = useState(() => {
    return !!(localStorage.getItem('rr_admin') || localStorage.getItem('token'));
  });
  const login = password => {
    if (password === 'admin123') {
      setAuth(true);
      localStorage.setItem('rr_admin', '1');
      return true;
    } else return false;
  };
  const logout = () => {
    setAuth(false);
    localStorage.removeItem('rr_admin');
    localStorage.removeItem('token');
  };
  useEffect(() => {
    const checkAuth = () => {
      const hasAuth = !!(localStorage.getItem('rr_admin') || localStorage.getItem('token'));
      setAuth(hasAuth);
    };
    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);
  const value = useMemo(() => ({ isAuth, login, logout }), [isAuth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function RequireAuth({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/" />;
}

function AdminLoginModal({ open, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const handleSubmit = e => {
    e.preventDefault();
    if (!login(password)) {
      setError('Invalid password!');
    } else {
      setError('');
      setPassword('');
      onClose && onClose();
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
  const { isAuth, logout } = useAuth();
  const [loginModal, setLoginModal] = useState(false);
  const location = useLocation();
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  return (
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
              {isAuth ? (
                <>
                  <Button 
                    color="secondary" 
                    variant="contained" 
                    component={RouterLink} 
                    to="/manage"
                    sx={{ 
                      fontWeight: 800,
                      textTransform: 'none',
                      boxShadow: '0 4px 16px rgba(253,93,93,0.3)'
                    }}
                  >
                    Manage Stock
                  </Button>
                  <Button 
                    color="error" 
                    onClick={logout}
                    sx={{ 
                      fontWeight: 700,
                      textTransform: 'none'
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  color="secondary" 
                  variant="contained" 
                  onClick={()=>setLoginModal(true)}
                  sx={{ 
                    fontWeight: 800,
                    textTransform: 'none',
                    boxShadow: '0 4px 16px rgba(253,93,93,0.3)'
                  }}
                >
                  Manager Login
                </Button>
              )}
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
            <Route path="/manage" element={<StockDashboard />} />
            <Route path="/admin" element={<RequireAuth><AdminDashboardPage /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </Box>
      <AdminLoginModal open={loginModal} onClose={()=>setLoginModal(false)} />
      <CartDrawer open={cartDrawer} onClose={() => setCartDrawer(false)} />
    </CartProvider>
  );
}
