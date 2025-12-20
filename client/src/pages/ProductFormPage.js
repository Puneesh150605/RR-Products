import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Card, CircularProgress, Alert, MenuItem, Typography, Stack } from '@mui/material';
import { resolveImageUrl } from '../utils/image';

const categories = [
  "Engine Parts", "Body & Frame", "Electrical & Lighting",
  "Brakes & Suspension", "Wheels & Tyres", "Accessories", "Oils & Lubricants"
];

export default function ProductFormPage() {
  const { id } = useParams();
  const [data, setData] = useState({ name: '', description: '', brand: '', category: '', price: '', stock: '', image: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`/api/products/${id}`)
        .then(res => setData({ ...res.data, image: null }))
        .catch(() => setError('Failed to load product'))
        .finally(() => setLoading(false));
    }
  }, [id]);
  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      const file = files?.[0];
      if (!file) return;
      uploadImage(file);
      return;
    } else {
      setData(d => ({ ...d, [name]: value }));
    }
  };

  const uploadImage = async (file) => {
    setError(null);
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const rrAdmin = localStorage.getItem('rr_admin');
      if (!token && !rrAdmin) {
        setError('Please login first to upload images!');
        return;
      }
      // Prefer rr_admin for admin actions even if a non-admin token exists
      const authHeaders = rrAdmin ? { 'X-RR-Admin': '1' } : { Authorization: `Bearer ${token}` };
      const fd = new FormData();
      fd.append('image', file);
      const res = await axios.post('/api/uploads/image', fd, {
        headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' }
      });
      const url = res?.data?.url;
      if (!url) throw new Error('Upload failed');
      setData(d => ({ ...d, image: url }));
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const rrAdmin = localStorage.getItem('rr_admin');
      if (!token && !rrAdmin) {
        setError('Please login first to add/edit products!');
        setLoading(false);
        return;
      }

      // Prefer rr_admin for admin actions even if a non-admin token exists
      const authHeaders = rrAdmin ? { 'X-RR-Admin': '1' } : { Authorization: `Bearer ${token}` };
      
      // Prepare data (exclude image file if it's a File object, use image URL string instead)
      const submitData = {
        name: data.name,
        brand: data.brand,
        category: data.category,
        price: parseFloat(data.price) || 0,
        stock: parseInt(data.stock) || 0,
        description: data.description,
        // Ensure every product has a photo
        image: (typeof data.image === 'string' && data.image.trim()) ? data.image.trim() : '/no-image.png'
      };

      const config = { headers: { ...authHeaders, 'Content-Type': 'application/json' } };
      if (id) {
        await axios.put(`/api/products/${id}`, submitData, config);
      } else {
        await axios.post('/api/products', submitData, config);
      }
      navigate('/manage');
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.details || 'Failed to save product. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
      <Card sx={{ p: 4 }}>
        <Typography variant="h5" mb={2}>{id ? 'Edit' : 'New'} Product</Typography>
        <form onSubmit={handleSubmit}>
          <TextField name="name" label="Product Name" fullWidth required value={data.name} onChange={handleChange} margin="normal" />
          <TextField name="brand" label="Brand" fullWidth value={data.brand} onChange={handleChange} margin="normal" />
          <TextField select name="category" label="Category" fullWidth value={data.category} onChange={handleChange} margin="normal">
            <MenuItem value="">--Select--</MenuItem>
            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>
          <TextField name="price" label="Price (₹)" type="number" fullWidth required value={data.price} onChange={handleChange} margin="normal" inputProps={{ min: 0 }} />
          <TextField name="stock" label="Stock Quantity" type="number" fullWidth required value={data.stock} onChange={handleChange} margin="normal" inputProps={{ min: 0 }} />
          <TextField name="description" label="Description" fullWidth multiline minRows={2} value={data.description} onChange={handleChange} margin="normal" />

          <Stack spacing={1.2} sx={{ mt: 2 }}>
            <Typography fontWeight={800}>Product Image</Typography>
            <Button variant="outlined" component="label" disabled={uploading || loading}>
              {uploading ? 'Uploading...' : 'Upload Image File'}
              <input type="file" hidden accept="image/*" name="imageFile" onChange={handleChange} />
            </Button>
            <TextField
              name="image"
              label="Image URL (auto-filled after upload)"
              fullWidth
              value={typeof data.image === 'string' ? data.image : ''}
              onChange={handleChange}
              margin="normal"
              helperText="Upload a real image using the button above. This field will be filled automatically."
            />
            <Box
              sx={{
                height: 160,
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default'
              }}
            >
              <Box component="img" src={resolveImageUrl(typeof data.image === 'string' ? data.image : '')} alt="Preview" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          </Stack>
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" fullWidth disabled={loading}>{loading ? <CircularProgress size={20} /> : 'Save Product'}</Button>
        </form>
      </Card>
    </Box>
  );
}
