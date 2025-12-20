import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Avatar,
  Paper,
  Divider,
  Chip,
  Container
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import FactoryRoundedIcon from '@mui/icons-material/FactoryRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PrecisionManufacturingRoundedIcon from '@mui/icons-material/PrecisionManufacturingRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import axios from 'axios';
import { resolveImageUrl } from '../utils/image';
import '../App.css';

export default function HomePage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
    const lowStock = products.filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) < 30).length;
    const categories = new Set(products.map(p => p.category).filter(Boolean)).size;
    return { totalStock, lowStock, categories, count: products.length };
  }, [products]);

  useEffect(() => {
    const applyData = (data) => {
      const arr = Array.isArray(data) ? data : [];
      setProducts(arr);
      setFeatured(arr.slice(0, 4));
    };

    axios.get('/api/products')
      .then(res => applyData(res.data))
      .catch(() => applyData([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <Box className="hero-section">
        <Container maxWidth="xl">
          <Box sx={{
            position: 'relative',
            minHeight: { xs: '70vh', md: '88vh' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            py: { xs: 10, md: 14 },
            zIndex: 1
          }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ width: '100%' }}
            >
              <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mb={2.5}>
                <FactoryRoundedIcon sx={{ fontSize: 68, color: 'primary.main' }} />
                <Typography variant="h1" sx={{ fontSize: { xs: '2.6rem', sm: '4.2rem', md: '5.7rem' }, fontWeight: 900 }} className="gradient-text">
                  RR Products
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ color: 'text.secondary', fontWeight: 800, mb: 2, fontSize: { xs: '1.25rem', md: '1.85rem' } }}>
                Two-Wheeler Parts Manufacturing & Stock Management
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 5, maxWidth: 980, mx: 'auto', fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.9 }}>
                Monitor production output, manage inventory, and keep warehouses synchronized with a modern manufacturing-grade dashboard.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="center">
                <Button variant="contained" color="primary" component={RouterLink} to="/catalog" size="large" sx={{ px: 6, py: 2, borderRadius: 3, fontWeight: 900 }}>
                  View Catalog
                </Button>
                <Button variant="outlined" color="primary" component={RouterLink} to="/manage" size="large" sx={{ px: 6, py: 2, borderRadius: 3, fontWeight: 900 }}>
                  Manage Stock
                </Button>
              </Stack>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* LIVE WAREHOUSE MONITORING */}
      <Box className="parts-section" sx={{ py: { xs: 6, md: 9 }, position: 'relative' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 7 } }}>
            <MonitorHeartRoundedIcon sx={{ fontSize: { xs: 48, md: 64 }, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" fontWeight={900} color="primary.main" mb={1.5} sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
              Live Warehouse Monitoring
            </Typography>
            <Typography variant="h6" color="text.secondary" maxWidth={820} mx="auto" sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, lineHeight: 1.9 }}>
              Real-time stock visibility across manufacturing lines and warehouses.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {[
              { icon: Inventory2RoundedIcon, value: loading ? '--' : stats.totalStock.toLocaleString(), label: 'Total Units in Warehouse', color: 'primary', subtitle: 'Across all SKUs' },
              { icon: BusinessRoundedIcon, value: loading ? '--' : stats.categories.toLocaleString(), label: 'Active Categories', color: 'info', subtitle: 'Manufacturing lines' },
              { icon: TrendingUpRoundedIcon, value: loading ? '--' : stats.count.toLocaleString(), label: 'Products (SKUs)', color: 'success', subtitle: 'In catalog' },
              { icon: AnalyticsRoundedIcon, value: loading ? '--' : stats.lowStock.toLocaleString(), label: 'Low Stock', color: 'warning', subtitle: 'Below threshold' },
            ].map((s, idx) => (
              <Grid item xs={6} md={3} key={s.label}>
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
                  <Card className="stat-card" sx={{ textAlign: 'center', p: { xs: 3, md: 4 }, height: '100%' }}>
                    <s.icon sx={{ fontSize: { xs: 40, md: 56 }, color: `${s.color}.main`, mb: 2 }} />
                    <Typography variant="h3" fontWeight={900} color={`${s.color}.main`} mb={0.5} sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
                      {s.value}
                    </Typography>
                    <Typography variant="h6" fontWeight={900} color="text.primary" mb={0.5} sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
                      {s.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{s.subtitle}</Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 7, md: 11 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 12% 18%, rgba(34,108,255,0.18), transparent 45%), radial-gradient(circle at 86% 22%, rgba(16,185,129,0.12), transparent 45%), radial-gradient(circle at 50% 90%, rgba(255,212,59,0.08), transparent 48%)',
            zIndex: 0
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 7 } }}>
            <PrecisionManufacturingRoundedIcon sx={{ fontSize: { xs: 54, md: 68 }, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight={900} mb={1.5} className="gradient-text" sx={{ fontSize: { xs: '2.1rem', md: '3.2rem' } }}>
              Manufacturing Excellence
            </Typography>
            <Typography variant="h6" color="text.secondary" maxWidth={920} mx="auto" sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, lineHeight: 1.9 }}>
              Precision engineering, strict QA, and inventory intelligence — built for scale.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
            {[
              { icon: PrecisionManufacturingRoundedIcon, title: 'Advanced Production Lines', desc: 'Automation-first lines with calibrated tooling and stage-wise QC.', color: 'primary', image: '/images/excellence-production.svg', points: ['Automated stations', 'Stage-wise QC', 'High repeatability'] },
              { icon: AutoAwesomeRoundedIcon, title: 'Quality Assurance', desc: 'Incoming, in-process and final inspection aligned to best practices.', color: 'success', image: '/images/excellence-quality.svg', points: ['Incoming QC', 'In-process QC', 'Final inspection'] },
              { icon: SpeedRoundedIcon, title: 'High-Volume Output', desc: 'Scalable throughput engineered for peaks without sacrificing finish.', color: 'info', image: '/images/excellence-volume.svg', points: ['Capacity planning', 'Fast changeovers', 'Lean flow'] },
              { icon: SecurityRoundedIcon, title: 'Process Compliance', desc: 'Traceability and documentation for audit-friendly operations.', color: 'warning', image: '/images/excellence-compliance.svg', points: ['Traceability', 'Documentation', 'Process controls'] },
              { icon: LocalShippingRoundedIcon, title: 'Just-In-Time Delivery', desc: 'Optimized dispatch cycles with reliable packaging and readiness.', color: 'secondary', image: '/images/excellence-jit.svg', points: ['Dispatch SLAs', 'Packaging QA', 'On-time readiness'] },
              { icon: AnalyticsRoundedIcon, title: 'Data-Driven Operations', desc: 'Dashboards for stock, production trends and reorder decisions.', color: 'primary', image: '/images/excellence-analytics.svg', points: ['Live dashboards', 'Alerts & thresholds', 'Smarter reorder'] },
            ].map((feature, idx) => (
              <Grid item xs={12} md={6} lg={4} key={idx} sx={{ display: 'flex' }}>
                <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} style={{ height: '100%', width: '100%' }}>
                  <Card
                    sx={{
                      height: '100%',
                      overflow: 'hidden',
                      borderRadius: 5,
                      maxWidth: 520,
                      width: '100%',
                      mx: 'auto',
                      position: 'relative',
                      background: isDark
                        ? 'linear-gradient(135deg, rgba(10,14,20,0.72) 0%, rgba(18,26,43,0.92) 100%)'
                        : 'linear-gradient(135deg, rgba(30,91,255,0.10) 0%, rgba(0,163,141,0.08) 55%, rgba(255,255,255,0.92) 100%)',
                      border: isDark ? '1px solid rgba(34,108,255,0.18)' : '1px solid rgba(30,91,255,0.14)',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        borderColor: isDark ? 'rgba(34,108,255,0.45)' : 'rgba(30,91,255,0.35)',
                        boxShadow: isDark ? '0 18px 70px rgba(0,0,0,0.7)' : '0 22px 70px rgba(16,24,40,0.14)',
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 170 }}>
                      <Box
                        component="img"
                        src={resolveImageUrl(feature.image)}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.src = '/no-image.png';
                        }}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: isDark
                            ? 'linear-gradient(180deg, rgba(10,14,20,0.05) 0%, rgba(10,14,20,0.80) 100%)'
                            : 'linear-gradient(180deg, rgba(255,255,255,0.00) 0%, rgba(11,18,32,0.18) 55%, rgba(11,18,32,0.42) 100%)'
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 14,
                          right: 14,
                          width: 44,
                          height: 44,
                          borderRadius: 999,
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: isDark ? 'rgba(10,14,20,0.55)' : 'rgba(255,255,255,0.70)',
                          border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(30,91,255,0.16)',
                          backdropFilter: 'blur(10px)'
                        }}
                        aria-label={feature.title}
                        title={feature.title}
                      >
                        <feature.icon sx={{ color: `${feature.color}.main` }} />
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 3.5 }}>
                      <Typography variant="h5" fontWeight={900} sx={{ mb: 1.25, fontSize: '1.3rem' }}>
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary" lineHeight={1.9} sx={{ mb: 2 }}>
                        {feature.desc}
                      </Typography>
                      <Stack spacing={1}>
                        {feature.points.map((pt) => (
                          <Stack key={pt} direction="row" spacing={1} alignItems="center">
                            <CheckCircleRoundedIcon sx={{ fontSize: 18, color: 'success.main' }} />
                            <Typography color="text.primary" fontWeight={800} fontSize={14}>
                              {pt}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 10 }, position: 'relative' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
            <FactoryRoundedIcon sx={{ fontSize: { xs: 48, md: 64 }, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" fontWeight={900} color="primary.main" mb={2} sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
              Current Production Status
            </Typography>
            <Typography variant="h6" color="text.secondary" maxWidth={700} mx="auto" sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, lineHeight: 1.9 }}>
              Live inventory of manufactured parts ready for distribution
            </Typography>
          </Box>

          {featured.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={900} sx={{ mb: 1 }}>
                No products yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Add products from Manage Stock to start building your catalog.
              </Typography>
              <Button component={RouterLink} to="/manage" variant="contained" color="primary" sx={{ fontWeight: 900 }}>
                Go to Manage Stock
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {featured.map((p, idx) => (
                <Grid item xs={12} sm={6} md={3} key={p._id || idx}>
                  <motion.div whileHover={{ scale: 1.03, y: -6 }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
                    <Card className="stat-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <Box sx={{ height: 200, bgcolor: 'background.default', position: 'relative', overflow: 'hidden' }}>
                        <Box component="img" src={resolveImageUrl(p.image)} alt={p.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {Number(p.stock) < 30 && (
                          <Chip label="Low Stock" color="error" size="small" sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 800 }} />
                        )}
                      </Box>
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Chip label={p.category || 'Uncategorized'} size="small" color="primary" sx={{ mb: 1.5, alignSelf: 'flex-start', fontWeight: 800 }} />
                        <Typography variant="h6" fontWeight={900} color="primary.main" mb={1} sx={{ minHeight: 56 }}>
                          {p.name}
                        </Typography>
                        <Typography color="secondary.main" fontWeight={800} mb={1}>
                          {p.brand || '—'}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2 }}>
                          <Typography variant="h6" fontWeight={900} color="text.primary">
                            ₹{(p.price || 0).toLocaleString()}
                          </Typography>
                          <Chip label={`${Number(p.stock) || 0} units`} color={Number(p.stock) > 30 ? 'success' : 'warning'} size="small" icon={<CheckCircleRoundedIcon />} sx={{ fontWeight: 800 }} />
                        </Box>
                        <Button fullWidth variant="contained" color="primary" component={RouterLink} to={p._id ? `/products/${p._id}` : '#'} sx={{ mt: 2, fontWeight: 900 }} disabled={!p._id}>
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <Box sx={{ bgcolor: 'background.paper', py: 8, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <FactoryRoundedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h5" fontWeight={900} className="gradient-text">
                  RR Products
                </Typography>
              </Stack>
              <Typography color="text.secondary" mb={2} lineHeight={1.8}>
                Premium two-wheeler component manufacturing with real-time inventory visibility and modern warehouse operations.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={900} mb={3} color="text.primary">
                Operations
              </Typography>
              <Stack spacing={1.5}>
                <Typography color="text.secondary">Production Facilities</Typography>
                <Typography color="text.secondary">Quality Control</Typography>
                <Typography color="text.secondary">Warehouse Management</Typography>
                <Typography color="text.secondary">Stock Monitoring</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={900} mb={3} color="text.primary">
                Contact
              </Typography>
              <Typography color="text.secondary" mb={1}>
                Email: <strong style={{ color: '#226cff' }}>shilpajain17038@gmail.com</strong>
              </Typography>
              <Typography color="text.secondary" mb={1}>
                Phone: <strong style={{ color: '#226cff' }}>+91-9636106979</strong>
              </Typography>
              <Typography color="text.secondary">
                Address: <strong style={{ color: '#226cff' }}>G-84, Major Shaitan Singh Colony, Vidyadhar Nagar, Jaipur, Rajasthan 302016</strong>
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 6 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography color="text.secondary">
              © 2010 RR Products Manufacturing. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}


