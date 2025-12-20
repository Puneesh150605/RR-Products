import React, { useEffect, useState } from 'react';
import { Card, Box, Typography, CircularProgress, Alert, Button, Stack, Grid } from '@mui/material';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/products');
        const data = res.data.length ? res.data : [
          { stock: 22 }, { stock: 14 }, { stock: 70 }, { stock: 210 }
        ];
        setStats({
          count: data.length,
          totalStock: data.reduce((sum, p) => sum + (p.stock || 0), 0),
          lowStock: data.filter(p => (p.stock || 0) < 30).length
        });
      } catch (e) {
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  
  return (
    <Box>
      <Typography variant="h4" mb={4} fontWeight={800} color="primary.main">
        Admin Dashboard
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Inventory2RoundedIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" color="text.secondary">Total Products</Typography>
            <Typography variant="h3" color="primary.main" fontWeight={900}>{stats.count}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Inventory2RoundedIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h6" color="text.secondary">Total Stock</Typography>
            <Typography variant="h3" color="secondary.main" fontWeight={900}>{stats.totalStock}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Inventory2RoundedIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
            <Typography variant="h6" color="text.secondary">Low Stock Items</Typography>
            <Typography variant="h3" color="warning.main" fontWeight={900}>{stats.lowStock}</Typography>
          </Card>
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
        <Button 
          variant="contained" 
          color="primary" 
          component={RouterLink} 
          to="/manage"
          size="large"
          startIcon={<Inventory2RoundedIcon />}
          sx={{ fontWeight: 700, px: 4 }}
        >
          Manage Stock & Inventory
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          component={RouterLink} 
          to="/catalog"
          size="large"
          startIcon={<EditRoundedIcon />}
          sx={{ fontWeight: 700, px: 4 }}
        >
          View Catalog
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          component={RouterLink} 
          to="/manage"
          size="large"
          startIcon={<AddRoundedIcon />}
          sx={{ fontWeight: 700, px: 4 }}
        >
          Add New Product
        </Button>
      </Stack>
    </Box>
  );
}
