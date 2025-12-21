import React, { useState } from 'react';
import { Card, Box, TextField, Button, Typography, Alert, Link, Container } from '@mui/material';
import { useAuth } from '../AuthContext';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Support legacy hardcoded admin login for backward compatibility/demo if needed
    // But AuthContext login logic should likely handle it. 
    // We will trust AuthContext.login 

    const result = await login(email, password);
    
    if (result.success) {
      // Decode user role or check result properties if available, 
      // but simpler is to check AuthContext or local storage.
      // However, for immediate redirection, we can check basic logic:
      // If email suggests admin or specific response flag.
      
      // We'll rely on the default redirection logic:
      // If previous location state exists (redirected from protected route), go there.
      // Else if admin, go to manage.
      // Else go to catalog or home.
      
      // Simplified:
      const from = location.state?.from?.pathname || '/';
      
      // Let's see if we can know if it's admin immediately. 
      // We can default to home/catalog, unless its admin.
      // Since `login` updates state asynchronously, we might just redirect generally.
      // BUT, AuthContext also sets localStorage.
      const isAdmin = localStorage.getItem('rr_admin') === '1';
      
      if (isAdmin) {
          navigate('/manage');
      } else {
        // If "from" was login page itself ( shouldn't happen usually), default to catalog
        navigate(from === '/login' ? '/catalog' : from);
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <Container maxWidth="sm">
        <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card sx={{ p: 5, width: '100%', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h4" fontWeight={800} mb={3} textAlign="center" color="primary.main">
                    Welcome Back
                </Typography>
                <form onSubmit={handleLogin}>
                <TextField 
                    label="Email" 
                    value={email} 
                    onChange={e=>setEmail(e.target.value)} 
                    fullWidth 
                    margin="normal" 
                    autoComplete="email" 
                    required 
                />
                <TextField 
                    label="Password" 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    type="password" 
                    fullWidth 
                    margin="normal" 
                    autoComplete="current-password" 
                    required 
                />
                
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                
                <Button 
                    variant="contained" 
                    size="large" 
                    fullWidth 
                    type="submit" 
                    sx={{ mt: 4, mb: 2, py: 1.5, fontWeight: 700, fontSize: '1.1rem' }}
                >
                    Login
                </Button>
                </form>

                <Box mt={2} textAlign="center">
                    <Typography color="text.secondary">
                        Don't have an account?{' '}
                        <Link component={RouterLink} to="/signup" fontWeight={700} underline="hover">
                            Sign up here
                        </Link>
                    </Typography>
                </Box>
            </Card>
        </Box>
    </Container>
  );
}
