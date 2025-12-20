import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../CartContext';
import axios from 'axios';
import { Box, Tabs, Tab, Grid, Card, CardContent, Typography, Chip, CircularProgress, Snackbar, Alert, Container, Stack, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { resolveImageUrl } from '../utils/image';
import '../App.css';

const categories = [
  "All", "Engine Parts", "Body & Frame", "Electrical & Lighting",
  "Brakes & Suspension", "Wheels & Tyres", "Accessories", "Oils & Lubricants"
];

export default function CatalogPage() {
  const { addToCart } = useCart();
  const [snack, setSnack] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    const categoryParam = selectedCategory === 'All' ? '' : `?category=${encodeURIComponent(selectedCategory)}`;
    axios.get(`/api/products${categoryParam}`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(selectedCategory === 'All' ? data : data.filter(p => p.category === selectedCategory));
      })
      .catch(() => {
        setProducts([]);
        setError('Error loading products');
      })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const displayProducts = products;

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          fontWeight={900} 
          sx={{
            background: 'linear-gradient(135deg, #226cff 0%, #338eff 50%, #10b981 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Manufacturing Inventory
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth={700} mx="auto">
          Real-time stock levels of all manufactured parts across production facilities
        </Typography>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          mb: 6, 
          borderRadius: 4,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={selectedCategory}
          onChange={(e, val) => setSelectedCategory(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            '& .MuiTab-root': { 
              color: 'text.secondary', 
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              minHeight: 64,
              '&:hover': {
                color: 'primary.main'
              }
            },
            '& .Mui-selected': { 
              color: 'primary.main',
            }
          }}
          TabIndicatorProps={{ 
            style: { 
              background: 'linear-gradient(90deg, #226cff 0%, #10b981 100%)', 
              height: 3, 
              borderRadius: 2 
            } 
          }}
        >
          {categories.map((cat) => (
            <Tab 
              value={cat} 
              label={cat} 
              key={cat}
              sx={{ px: 3 }}
            />
          ))}
        </Tabs>
      </Paper>

      {loading ? (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight={400}>
          <CircularProgress color="primary" size={64} thickness={4} />
        </Box>
      ) : !displayProducts.length ? (
        <Alert severity="error" sx={{ mb: 4 }}>{error || 'No products found.'}</Alert>
      ) : (
        <>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Showing {displayProducts.length} {displayProducts.length === 1 ? 'product' : 'products'}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {displayProducts.map((p, i) => (
              <Grid item xs={12} sm={6} key={p._id || i}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -8 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ height: "100%" }}
                >
                  <Card 
                    onClick={() => p._id ? navigate(`/products/${p._id}`) : null} 
                    sx={{ 
                      cursor: p._id ? "pointer" : 'default',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 12px 48px rgba(34,108,255,0.3)',
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <Box sx={{
                      height: 200,
                      bgcolor: 'background.default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Box 
                        component="img" 
                        src={resolveImageUrl(p.image)} 
                        alt={p.name} 
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      {p.stock === 0 ? (
                        <Chip 
                          label="Out of Stock" 
                          color="error" 
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: 12, 
                            right: 12,
                            fontWeight: 700
                          }}
                        />
                      ) : p.stock < 30 ? (
                        <Chip 
                          label="Low Stock" 
                          color="warning" 
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: 12, 
                            right: 12,
                            fontWeight: 700
                          }}
                        />
                      ) : (
                        <Chip 
                          label="In Stock" 
                          color="success" 
                          size="small"
                          icon={<CheckCircleRoundedIcon />}
                          sx={{ 
                            position: 'absolute', 
                            top: 12, 
                            right: 12,
                            fontWeight: 700
                          }}
                        />
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Chip 
                        label={p.category} 
                        size="small" 
                        color="primary"
                        sx={{ mb: 1.5, alignSelf: 'flex-start', fontWeight: 700 }}
                      />
                      <Typography 
                        fontWeight={800} 
                        fontSize={18}
                        color="primary.main"
                        mb={1}
                        sx={{ 
                          minHeight: 54,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {p.name}
                      </Typography>
                      <Typography 
                        color="secondary.main" 
                        fontWeight={700} 
                        mb={1.5}
                        fontSize={15}
                      >
                        {p.brand}
                      </Typography>
                      <Box sx={{ mt: 'auto', pt: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography 
                            variant="h5" 
                            fontWeight={900} 
                            color="text.primary"
                          >
                            ₹{p.price.toLocaleString()}
                          </Typography>
                          <Chip 
                            label={`${p.stock} units`} 
                            color={p.stock > 30 ? "success" : p.stock > 10 ? "warning" : "error"} 
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        </Stack>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={() => p._id ? navigate(`/products/${p._id}`) : null}
                          sx={{
                            borderRadius: 2,
                            py: 1.2,
                            mb: 1,
                            fontWeight: 800,
                            textTransform: 'none',
                            '&:hover': {
                              boxShadow: '0 8px 24px rgba(34,108,255,0.4)'
                            }
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="secondary"
                          sx={{ borderRadius: 2, fontWeight: 700, mb: 0.5 }}
                          onClick={e => { e.stopPropagation && e.stopPropagation(); addToCart(p); setSnack(true); }}
                          disabled={p.stock === 0}
                        >
                          Add to Cart
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      <Snackbar 
        open={!!error} 
        autoHideDuration={4000} 
        onClose={() => setError(null)} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    <Snackbar
      open={snack}
      autoHideDuration={2000}
      onClose={() => setSnack(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={() => setSnack(false)} severity="success" sx={{ width: '100%' }}>
        Added to Cart!
      </Alert>
    </Snackbar>
  </Container>
  );
}
