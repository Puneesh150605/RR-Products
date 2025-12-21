import React, { useState } from 'react';
import { Card, Box, TextField, Button, Typography, Alert, Link, Container } from '@mui/material';
import { useAuth } from '../AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    // Basic validation
    if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
    }

    const res = await signup(name, email, password);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(res.error);
    }
  };

  return (
    <Container maxWidth="sm">
        <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ p: 5, width: '100%', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <Typography variant="h4" fontWeight={800} mb={3} textAlign="center" color="primary.main">
                Create Account
            </Typography>
            
            <form onSubmit={handleSubmit}>
            <TextField 
                label="Full Name" 
                value={name} 
                onChange={e=>setName(e.target.value)} 
                fullWidth 
                margin="normal" 
                required 
            />
            <TextField 
                label="Email Address" 
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                fullWidth 
                margin="normal" 
                type="email"
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
                autoComplete="new-password" 
                helperText="Must be at least 6 characters"
                required 
            />
            
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>Account created! Redirecting...</Alert>}
            
            <Button 
                variant="contained" 
                size="large" 
                fullWidth 
                type="submit" 
                sx={{ mt: 4, mb: 2, py: 1.5, fontWeight: 700, fontSize: '1.1rem' }}
            >
                Sign Up
            </Button>
            </form>

            <Box mt={2} textAlign="center">
                <Typography color="text.secondary">
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login" fontWeight={700} underline="hover">
                        Login here
                    </Link>
                </Typography>
            </Box>
        </Card>
        </Box>
    </Container>
  );
}
