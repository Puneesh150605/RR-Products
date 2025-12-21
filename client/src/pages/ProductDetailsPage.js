import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Card, CardMedia, Chip, Stack, Divider, CircularProgress, Alert, Container, Grid, Paper, Button, Snackbar } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { resolveImageUrl } from '../utils/image';

export default function ProductDetailsPage() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [snack, setSnack] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [p, setP] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get('/api/products/' + id)
      .then(res => setP(res.data))
      .catch(() => {
        setP({
          _id: id,
          name: 'Premium Disc Brake Pad Set',
          brand: 'Brembo',
          category: 'Brakes & Suspension',
          price: 1890,
          stock: 45,
          description: 'High-performance ceramic brake pads designed for superior stopping power and durability. These premium brake pads offer excellent heat resistance and consistent performance under all conditions.',
          specs: {
            'Material': 'Ceramic Composite',
            'Fit': 'Universal',
            'Thickness': '12mm',
            'Warranty': '1 Year',
            'Compatibility': 'All Major Brands'
          },
          image: '/images/brake-pad.jpg'
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box mt={7} display="flex" justifyContent="center" minHeight={400} alignItems="center">
          <CircularProgress color="primary" size={64} />
        </Box>
      </Container>
    );
  }

  if (error && !p) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 6 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 700 }}
        color="inherit"
      >
        Back to Catalog
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              bgcolor: 'background.paper',
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Box sx={{
                height: { xs: 300, md: 500 },
                bgcolor: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <CardMedia
                  component="img"
                  image={resolveImageUrl(p.image)}
                  alt={p.name}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {p.stock < 30 && (
                  <Chip
                    label="Low Stock"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      px: 1
                    }}
                  />
                )}
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
                <Chip label={p.category} color="primary" sx={{ fontWeight: 700 }} />
                <Chip 
                  label={p.stock + ' in stock'} 
                  color={p.stock > 30 ? "success" : p.stock > 10 ? "warning" : "error"}
                  icon={<CheckCircleRoundedIcon />}
                  sx={{ fontWeight: 700 }}
                />
              </Stack>

              <Typography 
                variant="h3" 
                fontWeight={900} 
                color="primary.main" 
                mb={2}
                sx={{
                  background: p.name.includes('Premium') || p.name.includes('Pro') 
                    ? 'linear-gradient(135deg, #00B8D9 0%, #2962ff 100%)'
                    : 'none',
                  backgroundClip: p.name.includes('Premium') || p.name.includes('Pro') ? 'text' : 'unset',
                  WebkitBackgroundClip: p.name.includes('Premium') || p.name.includes('Pro') ? 'text' : 'unset',
                  WebkitTextFillColor: p.name.includes('Premium') || p.name.includes('Pro') ? 'transparent' : 'inherit'
                }}
              >
                {p.name}
              </Typography>

              <Typography variant="h5" color="secondary.main" fontWeight={800} mb={3}>
                {p.brand}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h2" fontWeight={900} color="primary.main" mb={1}>
                  ₹{p.price?.toLocaleString() || '0'}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                  {[...Array(5)].map((_, i) => (
                    <StarRoundedIcon key={i} sx={{ color: 'warning.main', fontSize: 24 }} />
                  ))}
                  <Typography color="text.secondary" sx={{ ml: 1 }}>
                    (4.8/5.0)
                  </Typography>
                </Stack>
              </Box>

<Stack direction="row" spacing={2} mb={4}>
  <Button
    variant="contained"
    color="secondary"
    size="large"
    sx={{
      flex: 1,
      py: 1.5,
      borderRadius: 3,
      fontWeight: 800,
      fontSize: '1.1rem',
      boxShadow: '0 8px 32px rgba(253,93,93,0.4)'
    }}
    onClick={() => { 
      if (!user) {
        navigate('/login', { state: { from: location } });
        return;
      }
      addToCart(p); setSnack(true); 
    }}
    disabled={p.stock === 0}
  >
    {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
  </Button>
</Stack>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" fontWeight={800} mb={2} color="text.primary">
                Description
              </Typography>
              <Typography color="text.secondary" lineHeight={1.8} mb={4}>
                {p.description || 'Premium quality product designed for optimal performance and durability. Trusted by professionals worldwide.'}
              </Typography>

              {p.specs && (
                <>
                  <Typography variant="h6" fontWeight={800} mb={2} color="text.primary">
                    Specifications
                  </Typography>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 3
                    }}
                  >
                    {typeof p.specs === 'string' ? (
                      <Typography color="text.secondary">{p.specs}</Typography>
                    ) : (
                      <Grid container spacing={2}>
                        {Object.entries(p.specs).map(([key, value]) => (
                          <Grid item xs={12} sm={6} key={key}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              py: 1,
                              borderBottom: '1px solid',
                              borderColor: 'divider'
                            }}>
                              <Typography color="text.secondary" fontWeight={600}>
                                {key}:
                              </Typography>
                              <Typography color="text.primary" fontWeight={700}>
                                {value}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Paper>
                </>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 8, mb: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 4,
                  textAlign: 'center'
                }}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" fontWeight={800} mb={1}>
                  Genuine Quality
                </Typography>
                <Typography color="text.secondary">
                  All products are authentic and sourced from certified manufacturers
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 4,
                  textAlign: 'center'
                }}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" fontWeight={800} mb={1}>
                  Fast Shipping
                </Typography>
                <Typography color="text.secondary">
                  Same-day dispatch for orders placed before 3 PM
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 4,
                  textAlign: 'center'
                }}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                <Typography variant="h6" fontWeight={800} mb={1}>
                  Easy Returns
                </Typography>
                <Typography color="text.secondary">
                  30-day return policy with full refund guarantee
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
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
