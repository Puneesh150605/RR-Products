import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, Chip, Stack, Container, InputAdornment, Divider, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import { resolveImageUrl } from '../utils/image';

const categories = [
  "Engine Parts", "Body & Frame", "Electrical & Lighting",
  "Brakes & Suspension", "Wheels & Tyres", "Accessories", "Oils & Lubricants"
];

const emptyProduct = {
  name: '', brand: '', category: '', description: '', specs: '', price: '', stock: '', image: ''
};

const getColumns = (onEditStock, onAddStock, onRemoveStock) => [
  { field: 'name', headerName: 'Product Name', flex: 1.2, minWidth: 200 },
  { field: 'category', headerName: 'Category', flex: 1, minWidth: 150 },
  { field: 'brand', headerName: 'Brand', flex: 0.8, minWidth: 120 },
  { field: 'price', headerName: 'Price (₹)', flex: 0.7, minWidth: 100, type: 'number' },
  { 
    field: 'stock', 
    headerName: 'Stock', 
    flex: 0.7, 
    type: 'number',
    renderCell: (params) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography fontWeight={700} color={params.value === 0 ? 'error.main' : params.value < 30 ? 'warning.main' : 'success.main'}>
          {params.value}
        </Typography>
        <Chip 
          label={params.value === 0 ? 'Out of Stock' : params.value < 30 ? 'Low Stock' : 'In Stock'} 
          size="small"
          color={params.value === 0 ? 'error' : params.value < 30 ? 'warning' : 'success'}
          sx={{ fontWeight: 700 }}
        />
      </Stack>
    )
  },
  {
    field: 'stockActions',
    headerName: 'Stock Management',
    flex: 2.2,
    minWidth: 380,
    sortable: false,
    renderCell: (params) => {
      return (
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Button
            size="small"
            color="success"
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onAddStock(params.row);
            }}
            sx={{ minWidth: 110, fontWeight: 700, fontSize: '0.85rem' }}
            title="Add Units to Stock"
          >
            Add Units
          </Button>
          <Button
            size="small"
            color="warning"
            variant="contained"
            startIcon={<RemoveRoundedIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveStock(params.row);
            }}
            sx={{ minWidth: 110, fontWeight: 700, fontSize: '0.85rem' }}
            title="Remove Units from Stock"
          >
            Remove Units
          </Button>
          <Button
            size="small"
            color="primary"
            variant="contained"
            startIcon={<EditRoundedIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onEditStock(params.row);
            }}
            sx={{ minWidth: 110, fontWeight: 700, fontSize: '0.85rem' }}
            title="Edit Stock Quantity"
          >
            Edit Stock
          </Button>
        </Stack>
      );
    }
  },
  {
    field: 'actions',
    headerName: 'Product Actions',
    flex: 1.8,
    minWidth: 220,
    sortable: false,
    renderCell: (params) => {
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            size="small"
            color="primary"
            variant="contained"
            startIcon={<EditRoundedIcon />}
            onClick={(e) => {
              e.stopPropagation();
              params.row.onEdit?.(params.row);
            }}
            sx={{ minWidth: 100, fontWeight: 700, fontSize: '0.85rem' }}
            title="Edit Product Details"
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            variant="contained"
            startIcon={<DeleteRoundedIcon />}
            onClick={(e) => {
              e.stopPropagation();
              params.row.onDelete?.(params.row);
            }}
            sx={{ minWidth: 100, fontWeight: 700, fontSize: '0.85rem' }}
            title="Delete Product from Inventory"
          >
            Delete
          </Button>
        </Stack>
      );
    }
  }
];

export default function StockDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState({ open: false, type: '', initial: emptyProduct });
  const [form, setForm] = useState(emptyProduct);
  const [formLoading, setFormLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stockModal, setStockModal] = useState({ open: false, product: null, action: '', quantity: '' });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('token');
    const rrAdmin = localStorage.getItem('rr_admin');
    return !!(token || rrAdmin);
  });
  
  const isAuthenticated = () => {
    return !!(localStorage.getItem('token') || localStorage.getItem('rr_admin'));
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const rrAdmin = localStorage.getItem('rr_admin');
    if (rrAdmin) return { 'X-RR-Admin': '1' };
    if (token) return { Authorization: `Bearer ${token}` };
    return {};
  };

  const uploadImage = async (file) => {
    setSnackbar({ open: false, message: '', severity: 'success' });
    setFormLoading(true);
    try {
      if (!isAuthenticated()) {
        setSnackbar({ open: true, message: 'Please login first to upload images!', severity: 'warning' });
        return null;
      }
      const fd = new FormData();
      fd.append('image', file);
      const res = await axios.post('/api/uploads/image', fd, {
        headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
      });
      return res?.data?.url || null;
    } catch (err) {
      setSnackbar({ open: true, message: err?.response?.data?.error || 'Image upload failed!', severity: 'error' });
      return null;
    } finally {
      setFormLoading(false);
    }
  };
  
  // Update login state (call this, don't call in render)
  // (kept intentionally simple; UI uses isAuthenticated() + storage listener)

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Error loading products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!isAuthenticated()) {
      setSnackbar({ open: true, message: 'Please login first!', severity: 'warning' });
      return;
    }
    const ok = window.confirm('This will DELETE ALL products and empty the catalog.\n\nDo you want to continue?');
    if (!ok) return;
    try {
      await axios.delete('/api/products', { headers: getAuthHeaders() });
      setSnackbar({ open: true, message: 'Inventory cleared successfully.', severity: 'success' });
      fetchProducts();
    } catch (err) {
      const status = err?.response?.status;
      const apiMsg = err?.response?.data?.error || err?.response?.data?.details;
      if (status === 404) {
        setSnackbar({ open: true, message: 'Clear Inventory endpoint not available (404). Please restart the server.', severity: 'error' });
      } else if (status === 401 || status === 403) {
        setSnackbar({ open: true, message: apiMsg || 'Admin access required. Please login as admin.', severity: 'error' });
      } else {
        setSnackbar({ open: true, message: apiMsg || `Failed to clear inventory${status ? ` (HTTP ${status})` : ''}!`, severity: 'error' });
      }
    }
  };

  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
    const lowStock = products.filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) < 30).length;
    const outOfStock = products.filter(p => (Number(p.stock) || 0) === 0).length;
    const categoriesCount = new Set(products.map(p => p.category).filter(Boolean)).size;
    return { totalStock, lowStock, outOfStock, categoriesCount, count: products.length };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      if (!matchesCategory) return false;
      if (!q) return true;
      const hay = `${p.name || ''} ${p.brand || ''} ${p.category || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [products, search, categoryFilter]);

  useEffect(() => { 
    // Check auth immediately on mount - check both methods
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const rrAdmin = localStorage.getItem('rr_admin');
      setIsLoggedIn(!!(token || rrAdmin));
    };
    
    checkAuth();
    fetchProducts();
    
    const interval = setInterval(checkAuth, 500);
    
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'rr_admin' || !e.key) {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAdd = () => {
    if (!isAuthenticated()) {
      setSnackbar({ open: true, message: 'Please login first!', severity: 'warning' });
      return;
    }
    setForm(emptyProduct);
    setModal({ open: true, type: 'add', initial: emptyProduct });
  };
  const handleEdit = (row) => {
    if (!isAuthenticated()) {
      setSnackbar({ open: true, message: 'Please login first!', severity: 'warning' });
      return;
    }
    setForm(row);
    setModal({ open: true, type: 'edit', initial: row });
  };
  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete "${row.name}"?\n\nThis action cannot be undone!`)) return;
    try {
      if (!isAuthenticated()) {
        setSnackbar({ open: true, message: 'Please login first! Go to /login to authenticate.', severity: 'error' });
        return;
      }
      await axios.delete(`/api/products/${row._id}`, {
        headers: getAuthHeaders()
      });
      setSnackbar({ open: true, message: `"${row.name}" deleted successfully!`, severity: 'success' });
      fetchProducts();
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err?.message || 'Delete failed! Make sure you are logged in as admin.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
      console.error('Delete error:', err);
    }
  };
  const handleCloseModal = () => setModal({ ...modal, open: false });
  const handleFormChange = e => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      const file = files?.[0];
      if (!file) return;
      uploadImage(file).then((url) => {
        if (url) setForm(f => ({ ...f, image: url }));
      });
      return;
    }
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submitted:', { type: modal.type, form });
    
    setFormLoading(true);
    try {
      if (!isAuthenticated()) {
        setSnackbar({ open: true, message: 'Please login first! Go to /login to authenticate.', severity: 'error' });
        setFormLoading(false);
        return;
      }
      
      const submitData = {
        name: (form.name || '').trim(),
        brand: (form.brand || '').trim(),
        category: form.category || '',
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock) || 0,
        description: (form.description || '').trim(),
        specs: (form.specs || '').trim(),
        image: (form.image || '').trim() || '/no-image.png'
      };

      if (!submitData.name) {
        setSnackbar({ open: true, message: 'Product Name is required!', severity: 'error' });
        setFormLoading(false);
        return;
      }
      if (!submitData.category) {
        setSnackbar({ open: true, message: 'Category is required! Please select a category.', severity: 'error' });
        setFormLoading(false);
        return;
      }
      if (submitData.price <= 0) {
        setSnackbar({ open: true, message: 'Price must be greater than 0!', severity: 'error' });
        setFormLoading(false);
        return;
      }
      if (submitData.stock < 0) {
        setSnackbar({ open: true, message: 'Stock cannot be negative!', severity: 'error' });
        setFormLoading(false);
        return;
      }

      console.log('Submitting data:', submitData);

      const config = { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } };
      
      if (modal.type === 'add') {
        const response = await axios.post('/api/products', submitData, config);
        console.log('Product added:', response.data);
        setSnackbar({ 
          open: true, 
          message: `"${submitData.name}" added successfully! It's now available in Catalog and Inventory. View it in Catalog →`, 
          severity: 'success',
          autoHideDuration: 6000,
          action: (
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => {
                setSnackbar({ ...snackbar, open: false });
                navigate('/catalog');
              }}
              sx={{ fontWeight: 700 }}
            >
              View Catalog
            </Button>
          )
        });
        setModal({ ...modal, open: false });
        setForm(emptyProduct);
        await fetchProducts();
      } else {
        const response = await axios.put(`/api/products/${form._id}`, submitData, config);
        console.log('Product updated:', response.data);
        setSnackbar({ open: true, message: `"${submitData.name}" updated successfully!`, severity: 'success' });
        setModal({ ...modal, open: false });
        setForm(emptyProduct);
        await fetchProducts();
      }
    } catch (err) {
      console.error('Form submit error:', err);
      console.error('Error response:', err?.response);
      
      let errorMsg = 'Failed to save product! ';
      if (err?.response?.status === 401) {
        errorMsg += 'You are not logged in. Please login first.';
      } else if (err?.response?.status === 403) {
        errorMsg += 'You do not have permission. Admin access required.';
      } else if (err?.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err?.response?.data?.details) {
        errorMsg += err.response.data.details;
      } else if (err?.message) {
        errorMsg += err.message;
      }
      
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setFormLoading(false);
    }
  };
  const handleEditStock = (product) => {
    if (!isAuthenticated()) {
      setSnackbar({ open: true, message: 'Please login first!', severity: 'warning' });
      return;
    }
    setStockModal({ open: true, product, action: 'edit', quantity: product.stock || 0 });
  };

  const handleAddStock = (product) => {
    if (!isAuthenticated()) {
      setSnackbar({ open: true, message: 'Please login first!', severity: 'warning' });
      return;
    }
    setStockModal({ open: true, product, action: 'add', quantity: '' });
  };

  const handleRemoveStock = (product) => {
    if (!isAuthenticated()) {
      setSnackbar({ open: true, message: 'Please login first!', severity: 'warning' });
      return;
    }
    setStockModal({ open: true, product, action: 'remove', quantity: '' });
  };

  const handleStockSubmit = async () => {
    if (!stockModal.quantity || isNaN(stockModal.quantity) || parseInt(stockModal.quantity) < 0) {
      setSnackbar({ open: true, message: 'Please enter a valid quantity!', severity: 'error' });
      return;
    }
    
    setFormLoading(true);
    try {
      if (!isAuthenticated()) {
        setSnackbar({ open: true, message: 'Please login first!', severity: 'error' });
        setFormLoading(false);
        return;
      }

      const currentStock = stockModal.product.stock || 0;
      let newStock = 0;

      if (stockModal.action === 'edit') {
        newStock = parseInt(stockModal.quantity);
      } else if (stockModal.action === 'add') {
        newStock = currentStock + parseInt(stockModal.quantity);
      } else if (stockModal.action === 'remove') {
        newStock = Math.max(0, currentStock - parseInt(stockModal.quantity));
      }

      await axios.put(`/api/products/${stockModal.product._id}`, 
        { stock: newStock },
        { headers: getAuthHeaders() }
      );

      setSnackbar({ 
        open: true, 
        message: `Stock ${stockModal.action === 'edit' ? 'updated' : stockModal.action === 'add' ? 'added' : 'removed'} successfully!`, 
        severity: 'success' 
      });
      setStockModal({ open: false, product: null, action: '', quantity: '' });
      fetchProducts();
    } catch (err) {
      setSnackbar({ open: true, message: err?.response?.data?.error || 'Stock update failed!', severity: 'error' });
    } finally {
      setFormLoading(false);
    }
  };

  const displayedRows = filteredProducts.map(p => ({ ...p, id: p._id, onEdit: handleEdit, onDelete: handleDelete }));

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 5,
            mb: 3,
            position: 'relative',
            overflow: 'hidden',
            backgroundImage:
              'radial-gradient(circle at 15% 20%, rgba(34,108,255,0.18), transparent 45%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.14), transparent 45%), linear-gradient(135deg, rgba(26,34,54,0.9) 0%, rgba(12,18,32,0.9) 100%)',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
              <Box>
                <Typography variant="h3" fontWeight={900} sx={{ mb: 0.5 }} className="gradient-text">
                  Manage Stock
                </Typography>
                <Typography color="text.secondary">
                  Professional inventory dashboard — add products, adjust stock, and keep production ready.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {isLoggedIn || isAuthenticated() ? (
                    <Chip label="✓ Logged In — Admin actions enabled" color="success" />
                  ) : (
                    <Chip label="Login required for admin actions" color="warning" />
                  )}
                </Box>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="stretch">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<RefreshRoundedIcon />}
                  onClick={fetchProducts}
                  disabled={loading}
                >
                  Refresh
                </Button>
                {!isAuthenticated() ? (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LoginRoundedIcon />}
                    component={RouterLink}
                    to="/login"
                  >
                    Login
                  </Button>
                ) : (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddRoundedIcon />}
                      onClick={handleAdd}
                    >
                      Add Product
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteRoundedIcon />}
                      onClick={handleClearAll}
                    >
                      Clear Inventory
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Stack>

            <Divider sx={{ my: 3, opacity: 0.6 }} />

            <Grid container spacing={2}>
              {[
                { label: 'Products', value: stats.count, color: 'primary' },
                { label: 'Total Stock', value: stats.totalStock, color: 'success' },
                { label: 'Low Stock', value: stats.lowStock, color: 'warning' },
                { label: 'Out of Stock', value: stats.outOfStock, color: 'error' },
                { label: 'Categories', value: stats.categoriesCount, color: 'info' },
              ].map((s) => (
                <Grid key={s.label} item xs={12} sm={6} md={2.4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      bgcolor: 'rgba(10, 14, 20, 0.35)',
                      border: '1px solid rgba(34,108,255,0.14)',
                    }}
                  >
                    <Typography color="text.secondary" fontWeight={700} fontSize={13}>
                      {s.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={900} color={`${s.color}.main`} sx={{ mt: 0.5 }}>
                      {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>

        <Paper sx={{ p: { xs: 2, md: 2.5 }, bgcolor: 'background.paper', borderRadius: 5 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} sx={{ mb: 2 }}>
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, brand, or category..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ minWidth: { xs: '100%', md: 260 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryRoundedIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="All">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        {loading ? (
          <Box display="flex" py={7} alignItems="center" justifyContent="center"><CircularProgress color="primary" size={48} /></Box>
        ) : displayedRows.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center', border: '2px dashed', borderColor: 'divider', borderRadius: 4 }}>
            <Inventory2RoundedIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
            <Typography variant="h5" color="text.secondary" mb={1} fontWeight={700}>
              No matching products
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Try a different search/category, or add a new product.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddRoundedIcon />}
              onClick={handleAdd}
              sx={{ fontWeight: 700, px: 4 }}
            >
              Add Product
            </Button>
          </Box>
        ) : (
          <div style={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={displayedRows}
              columns={getColumns(handleEditStock, handleAddStock, handleRemoveStock)}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              getRowHeight={() => 72}
              sx={{
                bgcolor: 'rgba(10, 14, 20, 0.25)',
                color: 'text.primary',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                '& .MuiDataGrid-columnHeader': { 
                  fontWeight: 800, 
                  fontSize: '0.95rem',
                  bgcolor: 'rgba(26,34,54,0.75)',
                  '&:focus-within': { outline: 'none' }
                },
                '& .MuiDataGrid-cell': { 
                  fontSize: '0.9rem',
                  '&:focus': { outline: 'none' }
                },
                '& .MuiButton-root': { 
                  textTransform: 'none',
                  fontWeight: 700
                },
                '& .MuiDataGrid-row:hover': {
                  bgcolor: 'rgba(34,108,255,0.05)'
                }
              }}
            />
          </div>
        )}
      </Paper>
      <Dialog 
        open={modal.open} 
        onClose={handleCloseModal} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddRoundedIcon color="primary" />
            {modal.type === 'add' ? 'Add New Product' : 'Edit Product'}
          </Box>
          <IconButton onClick={handleCloseModal} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <DialogContent sx={{ pt: 2, flex: 1, overflowY: 'auto' }}>
            <TextField 
              name="name" 
              value={form.name} 
              onChange={handleFormChange} 
              label="Product Name" 
              fullWidth 
              margin="normal" 
              required 
              autoFocus
              helperText="Enter the product name"
            />
            <TextField 
              name="brand" 
              value={form.brand} 
              onChange={handleFormChange} 
              label="Brand" 
              fullWidth 
              margin="normal"
              helperText="Enter the brand name (e.g., RR Premium)"
            />
            <TextField 
              select 
              name="category" 
              value={form.category} 
              onChange={handleFormChange} 
              label="Category" 
              fullWidth 
              margin="normal" 
              required
              helperText="Select a product category"
            >
              <MenuItem value="">--Select Category--</MenuItem>
              {categories.map(cat => <MenuItem value={cat} key={cat}>{cat}</MenuItem>)}
            </TextField>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField 
                name="price" 
                value={form.price} 
                onChange={handleFormChange} 
                label="Price (₹)" 
                fullWidth 
                type="number" 
                inputProps={{ min: 0, step: 0.01 }} 
                margin="normal" 
                required
                helperText="Enter price in rupees"
              />
              <TextField 
                name="stock" 
                value={form.stock} 
                onChange={handleFormChange} 
                label="Stock Quantity" 
                fullWidth 
                type="number" 
                inputProps={{ min: 0 }} 
                margin="normal" 
                required
                helperText="Enter initial stock"
              />
            </Box>
            <TextField 
              name="description" 
              value={form.description} 
              onChange={handleFormChange} 
              label="Description" 
              fullWidth 
              margin="normal" 
              multiline 
              rows={3}
              helperText="Describe the product features and benefits"
            />
            <TextField 
              name="specs" 
              value={form.specs} 
              onChange={handleFormChange} 
              label="Specifications (optional)" 
              fullWidth 
              margin="normal"
              helperText="Enter technical specifications"
            />
            <TextField 
              name="image" 
              value={form.image} 
              onChange={handleFormChange} 
              label="Image URL" 
              fullWidth 
              margin="normal" 
              helperText="Upload an image file below (recommended). This field will be auto-filled."
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ mt: 1 }}>
              <Button variant="outlined" component="label" disabled={formLoading} sx={{ minWidth: 220 }}>
                {formLoading ? 'Uploading...' : 'Upload Image File'}
                <input type="file" hidden accept="image/*" name="imageFile" onChange={handleFormChange} />
              </Button>
              <Box
                sx={{
                  flex: 1,
                  height: 110,
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.default'
                }}
              >
                <Box component="img" src={resolveImageUrl(form.image)} alt="Preview" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ 
            px: 4, 
            py: 3, 
            borderTop: '2px solid', 
            borderColor: 'primary.main', 
            bgcolor: 'background.default',
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
          }}>
            <Button 
              onClick={handleCloseModal} 
              variant="outlined"
              size="large"
              sx={{ minWidth: 140, fontWeight: 700, py: 1.5, fontSize: '1rem' }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={formLoading}
              size="large"
              startIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : <AddRoundedIcon />}
              sx={{ 
                minWidth: 220, 
                fontWeight: 700, 
                py: 1.5,
                fontSize: '1.1rem',
                boxShadow: '0 4px 16px rgba(34,108,255,0.4)',
                '&:hover': {
                  boxShadow: '0 6px 24px rgba(34,108,255,0.6)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  opacity: 0.6
                }
              }}
            >
              {formLoading ? 'Saving to Inventory...' : modal.type === 'add' ? '✓ Add to Inventory' : '✓ Update Product'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>{error}</Alert>
      </Snackbar>
      {/* Stock Management Modal */}
      <Dialog open={stockModal.open} onClose={() => setStockModal({ open: false, product: null, action: '', quantity: '' })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Inventory2RoundedIcon color="primary" />
          {stockModal.action === 'edit' ? 'Edit Stock' : stockModal.action === 'add' ? 'Add Units' : 'Remove Units'} - {stockModal.product?.name}
          <IconButton onClick={() => setStockModal({ open: false, product: null, action: '', quantity: '' })} sx={{ ml: 'auto', position: 'absolute', right: 12, top: 12 }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Current Stock:</Typography>
            <Typography variant="h5" fontWeight={900} color="primary.main">
              {stockModal.product?.stock || 0} units
            </Typography>
          </Box>
          <TextField
            fullWidth
            label={stockModal.action === 'edit' ? 'New Stock Quantity' : stockModal.action === 'add' ? 'Units to Add' : 'Units to Remove'}
            type="number"
            value={stockModal.quantity}
            onChange={(e) => setStockModal({ ...stockModal, quantity: e.target.value })}
            inputProps={{ min: 0 }}
            required
            helperText={
              stockModal.action === 'edit' 
                ? 'Enter the new total stock quantity'
                : stockModal.action === 'add'
                ? `After adding: ${(stockModal.product?.stock || 0) + (parseInt(stockModal.quantity) || 0)} units`
                : `After removing: ${Math.max(0, (stockModal.product?.stock || 0) - (parseInt(stockModal.quantity) || 0))} units`
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 2 }}>
          <Button onClick={() => setStockModal({ open: false, product: null, action: '', quantity: '' })}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleStockSubmit}
            disabled={formLoading || !stockModal.quantity}
            startIcon={formLoading ? <CircularProgress size={20} /> : <Inventory2RoundedIcon />}
          >
            {formLoading ? 'Updating...' : stockModal.action === 'edit' ? 'Update Stock' : stockModal.action === 'add' ? 'Add Units' : 'Remove Units'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(snackbar => ({ ...snackbar, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={()=>setSnackbar(snackbar => ({...snackbar, open:false}))} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
      </Container>
    </motion.div>
  );
}
