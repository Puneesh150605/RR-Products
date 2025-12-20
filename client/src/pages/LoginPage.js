import React, { useState } from 'react';
import { Card, Box, TextField, Button, Typography, Alert } from '@mui/material';
import axios from 'axios';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      // Also set the old auth for compatibility
      localStorage.setItem('rr_admin', '1');
      if (onLogin) onLogin(res.data);
      // Redirect to manage page
      window.location.href = '/manage';
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed');
    }
  };
  return (
    <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2}>Admin Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)} fullWidth margin="normal" autoComplete="email" required />
          <TextField label="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" fullWidth margin="normal" autoComplete="current-password" required />
          {error && <Alert severity="error">{error}</Alert>}
          <Button variant="contained" size="large" fullWidth type="submit" sx={{ mt: 2 }}>Login</Button>
        </form>
      </Card>
    </Box>
  );
}
